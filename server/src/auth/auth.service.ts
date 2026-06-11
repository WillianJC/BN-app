import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import type { JwtPayload } from './dto/jwt-payload.interface';
import type { RegisterDto } from './dto/register.dto';
import { User } from './entities/user.entity';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthService {
  private readonly logger = new LoggerService('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) {
      throw new ConflictException('Email already registered');
    }

    const saltRounds = parseInt(
      this.configService.get<string>('BCRYPT_SALT_ROUNDS', '10'),
    );
    const hashed = await bcrypt.hash(dto.password, saltRounds);
    const defaultRole = this.configService.get<string>(
      'DEFAULT_USER_ROLE',
      'user',
    );
    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
      role: defaultRole,
      dni: dto.dni ?? null,
    });
    await this.userRepo.save(user);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      select: { id: true, email: true, role: true, password: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
