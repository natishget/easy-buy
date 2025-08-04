import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

const PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  const allowedOrigins = [
    'http://localhost:3000',
    'https://easy-buy.vercel.app', // Replace with your actual frontend domain
  ];

  app.enableCors({
    origin: allowedOrigins, 
    credentials: true, 
  });

  await app.listen(PORT || 3015);
  console.log("server listening on port", PORT);
}
bootstrap();
