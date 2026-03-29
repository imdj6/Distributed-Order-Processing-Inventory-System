import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupBullBoard } from './infra/queue/bull-board';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  setupBullBoard(app);

  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    console.info(`App is running on ${port}`);
  });
}
bootstrap();
