import { v4 as uuid } from 'uuid';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { countries as countriesRaw } from '#commands/country/countries';
import datasource from '#config/ormconfig';
import { Country } from '#shared/domain/entity/country.entity';
import { AppModule } from '#/app.module';

async function importCountries(logger: Logger) {
  const countries: Country[] = [];

  if (!(await datasource.createQueryRunner().hasTable('countries'))) {
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

  await datasource
    .createQueryBuilder()
    .insert()
    .into(Country)
    .values(countries)
    .execute();

  logger.log('Countries inserted');

  return;
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const logger = new Logger('Import Countries command');
  app.useLogger(logger);

  await importCountries(logger);

  datasource.destroy();
  await app.close();
}

bootstrap();
