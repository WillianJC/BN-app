import { Body, Controller, Get, Logger, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';
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

  private readCookie(req: Request, name: string): string | undefined {
    const cookies = (req.cookies ?? {}) as Record<string, string | undefined>;
    return cookies[name];
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

  @Public()
  @Get('session')
  session(@Req() req: Request) {
    const cookies = (req.cookies ?? {}) as Record<string, string | undefined>;
    const token = cookies[this.cookieName];
    if (!token) {
      return { authenticated: false, user: null };
    }
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      if (!payload.sub) {
        return { authenticated: false, user: null };
      }
      return {
        authenticated: true,
        user: {
          sub: payload.sub,
          email: payload.email ?? null,
          role: payload.role ?? null,
        },
      };
    } catch {
      return { authenticated: false, user: null };
    }
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
  async passkeyRegisterOptions(
    @CurrentUser('sub') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const options =
      await this.webAuthnService.generateRegistrationOptions(userId);
    const signed = this.webAuthnService.signChallenge({
      op: 'register',
      userId,
      challenge: options.challenge,
      ts: Date.now(),
    });
    res.cookie(
      this.webAuthnService.getCookieName(),
      signed,
      this.webAuthnService.getCookieOptions(),
    );
    return options;
  }

  @Post('webauthn/register/verify')
  async passkeyRegisterVerify(
    @CurrentUser('sub') userId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() dto: WebAuthnRegistrationVerifyDto,
  ) {
    const rawCookie = this.readCookie(
      req,
      this.webAuthnService.getCookieName(),
    );
    const result = await this.webAuthnService.verifyRegistration(
      userId,
      rawCookie,
      dto.response,
    );
    res.clearCookie(
      this.webAuthnService.getCookieName(),
      this.webAuthnService.getCookieOptions(),
    );
    return result;
  }

  @Public()
  @Post('webauthn/login/options')
  async passkeyLoginOptions(@Res({ passthrough: true }) res: Response) {
    const options = await this.webAuthnService.generateAuthenticationOptions();
    const signed = this.webAuthnService.signChallenge({
      op: 'auth',
      challenge: options.challenge,
      ts: Date.now(),
    });
    res.cookie(
      this.webAuthnService.getCookieName(),
      signed,
      this.webAuthnService.getCookieOptions(),
    );
    return options;
  }

  @Public()
  @Post('webauthn/login/verify')
  async passkeyLoginVerify(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() dto: WebAuthnAuthenticationVerifyDto,
  ) {
    const rawCookie = this.readCookie(
      req,
      this.webAuthnService.getCookieName(),
    );
    const user = await this.webAuthnService.verifyAuthentication(
      rawCookie,
      dto.response,
    );

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    res.cookie(this.cookieName, token, this.cookieOptions);
    res.clearCookie(
      this.webAuthnService.getCookieName(),
      this.webAuthnService.getCookieOptions(),
    );

    return { message: 'Login successful', user };
  }
}
