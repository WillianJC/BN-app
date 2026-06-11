import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { BiometricLoginDto } from './dto/biometric-login.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { JwtPayload } from './dto/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
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
    const { access_token } = await this.authService.register(dto);

    res.cookie(this.cookieName, access_token, this.cookieOptions);

    return { message: 'Registration successful' };
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
  @Post('biometric-login')
  async biometricLogin(
    @Body() dto: BiometricLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, user } = await this.authService.biometricLogin(
      dto.dni,
    );

    res.cookie(this.cookieName, access_token, this.cookieOptions);

    return { message: 'Biometric login successful', user };
  }
}
