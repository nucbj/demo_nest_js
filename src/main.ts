import { NestFactory } from '@nestjs/core';
import { MainModule } from 'src/module';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  await app.listen(3001);
}
bootstrap();
