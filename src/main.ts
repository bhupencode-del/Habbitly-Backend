import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow CORS for mobile apps
  app.enableCors();

  // 👇 Listen on 0.0.0.0 instead of default localhost
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();

