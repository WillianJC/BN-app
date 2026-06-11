import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService('Bootstrap'),
  });

  const corsOrigins = process.env.CORS_ORIGINS?.split(',') ?? [
    'http://localhost:5173',
    'http://localhost:3001',
  ];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.SERVER_PORT ?? 3001;
  const host = process.env.APP_HOST ?? 'localhost';
  await app.listen(port, host);
  const logger = await app.resolve(LoggerService);
  logger.log(`Server running on http://${host}:${port}`);
}
bootstrap().catch((err) => {
  console.error('Fatal: bootstrap failed', err);
  process.exit(1);
});
