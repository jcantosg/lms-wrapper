import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import {
  Logger as NestJsLogger,
  VERSION_NEUTRAL,
  VersioningType,
} from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const logger = new NestJsLogger();
  const app = await NestFactory.create(AppModule);
  process.on('unhandledRejection', (error: Error) => {
    logger.error(`ERROR on async function: ${error.name} ${error.message}`);
  });

  app.useLogger(app.get(Logger));
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'X-Version',
    defaultVersion: VERSION_NEUTRAL,
  });
  app.enableCors({
    origin: [
      'https://dev-360.universae.com',
      'http://localhost:3001',
      'https://frontdev-ucp.universae.com/',
    ],
    methods: 'GET,HEAD,PUT,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(bodyParser.json({ limit: '50mb' }));

  await app.listen(3000);
}

bootstrap();
