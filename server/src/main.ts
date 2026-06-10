import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService('Bootstrap'),
  });

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001'],
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.SERVER_PORT ?? 3000;
  await app.listen(port);
  const logger = await app.resolve(LoggerService);
  logger.log(`Server running on http://localhost:${port}`);
}
bootstrap();
