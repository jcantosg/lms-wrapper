import { v4 as uuid } from 'uuid';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Connection } from 'typeorm';
import { INestApplicationContext, Logger } from '@nestjs/common';
import { countries as countriesRaw } from './countries';
import { Country } from '../../business-unit/domain/entity/country.entity';
import datasource from '../../../ormconfig';

async function importCountries(app: INestApplicationContext, logger: Logger) {
  const connection = app.get(Connection);
  const countries: Country[] = [];

  if (!(await connection.createQueryRunner().hasTable('countries'))) {
    logger.error('Table countries does not exists');

    return;
  }

  const count = await datasource
    .createQueryBuilder()
    .select()
    .from('countries', 'country')
    .getCount();

  if (count !== 0) {
    logger.error('Table countries is not empty');

    return;
  }

  countriesRaw.forEach((country) =>
    countries.push(
      Country.create(
        uuid(),
        country.ISO,
        country.ISO3,
        country.name,
        country.phone_code,
        country.emoji_flag,
      ),
    ),
  );

  await connection
    .createQueryBuilder()
    .insert()
    .into(Country)
    .values(countries)
    .execute();

  logger.log('Countries inserted');
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const logger = new Logger('Import Countries command');
  app.useLogger(logger);

  await importCountries(app, logger);

  await app.close();
}

bootstrap();
