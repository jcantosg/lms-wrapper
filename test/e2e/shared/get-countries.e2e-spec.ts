import { HttpServer, INestApplication } from '@nestjs/common';
import request from 'supertest';
import supertest from 'supertest';
import { CountryResponse } from '#shared/infrastructure/controller/country/get-country.response';
import { countries as countriesExpected } from '#commands/country/countries';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '../sga/e2e-auth-helper';
import { GetCountriesE2ESeed } from './get-countries.e2e-seeds';
import { E2eSeed } from '../e2e-seed';

const path = `/country`;

describe('Get Countries', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let superAdminAccessToken: string;
  let seeder: E2eSeed;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetCountriesE2ESeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetCountriesE2ESeed.superAdminUserEmail,
      GetCountriesE2ESeed.superAdminUserPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return all countries', async () => {
    const response = await request(httpServer)
      .get('/country')
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);
    const receivedCountries: CountryResponse[] = response.body;
    countriesExpected.push({
      ISO: 'AA',
      ISO3: 'AAA',
      name: GetCountriesE2ESeed.countryName,
      phone_code: '+89',
      emoji_flag: GetCountriesE2ESeed.countryEmoji,
    });
    expect(receivedCountries.length).toEqual(countriesExpected.length);

    const expectedCountries = countriesExpected.map((country) =>
      expect.objectContaining({
        name: country.name,
        emoji: country.emoji_flag,
      }),
    );

    expect(receivedCountries).toEqual(
      expect.arrayContaining(expectedCountries),
    );
  });

  it('should return all countries with assigned business unit', async () => {
    const response = await request(httpServer)
      .get('/country?filter=businessUnit')
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);
    expect(response.body.length).toEqual(1);
    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          name: GetCountriesE2ESeed.countryName,
          id: GetCountriesE2ESeed.countryId,
          emoji: GetCountriesE2ESeed.countryEmoji,
        },
      ]),
    );
  });

  afterAll(async () => {
    await app.close();
    await seeder.clear();
    await datasource.destroy();
  });
});
