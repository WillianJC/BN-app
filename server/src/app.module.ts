import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { FinancesModule } from './finances/finances.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    FinancesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_FILE_PATH ?? '../.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PG_HOST'),
        port: configService.get<number>('PG_PORT', 5432),
        username: configService.get<string>('PG_USER'),
        password: configService.get<string>('PG_PASSWORD'),
        database: configService.get<string>('PG_DB'),
        ssl:
          configService.get<string>('PG_SSLMODE') === 'require'
            ? {
                rejectUnauthorized:
                  configService.get<string>(
                    'PG_SSL_REJECT_UNAUTHORIZED',
                    'false',
                  ) === 'true',
              }
            : false,
        autoLoadEntities: true,
        synchronize:
          configService.get<string>('TYPEORM_SYNC', 'false') === 'true',
      }),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
