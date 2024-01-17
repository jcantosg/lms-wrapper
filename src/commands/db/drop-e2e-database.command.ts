import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '#/app.module';
import datasource from '#config/ormconfig';

async function dropDatabase(logger: Logger) {
  await datasource.createQueryRunner().clearDatabase('test');

  logger.log('Database dropped');
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const logger = new Logger('Drop database command');
  app.useLogger(logger);
  await dropDatabase(logger);
  await datasource.destroy();
  await app.close();
}

bootstrap();
