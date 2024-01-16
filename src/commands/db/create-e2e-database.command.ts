import datasource from '#config/ormconfig';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '#/app.module';
import { Logger } from '@nestjs/common';

async function createDatabase(logger: Logger) {
  await datasource.createQueryRunner().createDatabase('test', true);

  logger.log('Test database created');
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const logger = new Logger('Create Test Database Command');
  await createDatabase(logger);
  await datasource.destroy();
  await app.close();
}

bootstrap();
