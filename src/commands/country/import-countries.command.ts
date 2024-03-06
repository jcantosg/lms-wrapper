import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '#/app.module';
import datasource from '#config/ormconfig';
import { seedCountries } from '#commands/country/seed-countries';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const logger = new Logger('Import Countries command');
  app.useLogger(logger);

  await seedCountries(logger);

  await datasource.destroy();
  await app.close();
}

bootstrap();
