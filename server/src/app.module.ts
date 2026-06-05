import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
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
            ? { rejectUnauthorized: false }
            : false,
        autoLoadEntities: true,
        synchronize: configService.get<string>('PRODUCTION', 'false') !== 'true',
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
