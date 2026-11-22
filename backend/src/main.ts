import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadEnvFile } from 'node:process';
import { existsSync } from 'node:fs';

async function bootstrap() {
  for (const file of ['.env.local', '.env', '../.env.local', '../.env']) {
    if (existsSync(file)) loadEnvFile(file);
  }
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(
    Number(process.env.PORT ?? 4000),
    process.env.HOST ?? '127.0.0.1',
  );
}
bootstrap();
