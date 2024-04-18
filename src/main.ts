import { NestFactory } from '@nestjs/core';
import { PhoneBookModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(PhoneBookModule);
  app.enableShutdownHooks();
  const configService = app.get(ConfigService);
  const port = parseInt(configService.get('APP_PORT'));
  await app.listen(port);
}
bootstrap();
