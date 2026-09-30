import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser, { CookieParseOptions } from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  // ADD THIS LINE:
  console.log(`Backend is running on: http://localhost:${port}`);
}
bootstrap();
