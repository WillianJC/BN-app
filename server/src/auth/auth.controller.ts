import { Body, Controller, Get, Logger, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { WebAuthnService } from './webauthn.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { WebAuthnRegistrationVerifyDto } from './dto/webauthn-registration.dto';
import { WebAuthnAuthenticationVerifyDto } from './dto/webauthn-authentication.dto';
import type { JwtPayload } from './dto/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly webAuthnService: WebAuthnService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private get cookieOptions() {
    const sameSite = this.configService.get<'lax' | 'strict' | 'none'>(
      'COOKIE_SAME_SITE',
      'lax',
    );
    return {
      httpOnly:
        this.configService.get<string>('COOKIE_HTTP_ONLY', 'true') === 'true',
      sameSite,
      secure:
        sameSite === 'none' ||
        this.configService.get<string>('COOKIE_SECURE', 'false') === 'true',
      maxAge: parseInt(
        this.configService.get<string>('COOKIE_MAX_AGE', '604800000'),
      ),
    };
  }

  private get cookieName(): string {
    return this.configService.get<string>('JWT_COOKIE_NAME', 'token');
  }

  @Public()
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { access_token } = await this.authService.register(dto);
      res.cookie(this.cookieName, access_token, this.cookieOptions);
      return { message: 'Registration successful' };
    } catch (err) {
      this.logger.error(
        'Register failed',
        err instanceof Error ? err.stack : err,
      );
      throw err;
    }
  }

  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.login(
      dto.email,
      dto.password,
    );

    res.cookie(this.cookieName, access_token, this.cookieOptions);

    return { message: 'Login successful' };
  }

  @Get('me')
  me(@CurrentUser() user: JwtPayload) {
    return user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(this.cookieName, {
      httpOnly: this.cookieOptions.httpOnly,
      sameSite: this.cookieOptions.sameSite,
      secure: this.cookieOptions.secure,
    });
    return { message: 'Logout successful' };
  }

  @Post('webauthn/register/options')
  async passkeyRegisterOptions(@CurrentUser('sub') userId: string) {
    return this.webAuthnService.generateRegistrationOptions(userId);
  }

  @Post('webauthn/register/verify')
  async passkeyRegisterVerify(
    @CurrentUser('sub') userId: string,
    @Body() dto: WebAuthnRegistrationVerifyDto,
  ) {
    return this.webAuthnService.verifyRegistration(userId, dto.response);
  }

  @Public()
  @Post('webauthn/login/options')
  async passkeyLoginOptions() {
    return this.webAuthnService.generateAuthenticationOptions();
  }

  @Public()
  @Post('webauthn/login/verify')
  async passkeyLoginVerify(
    @Body() dto: WebAuthnAuthenticationVerifyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.webAuthnService.verifyAuthentication(dto.response);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    res.cookie(this.cookieName, token, this.cookieOptions);

    return { message: 'Login successful', user };
  }
}
