import { HttpServer, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CountryResponse } from '#shared/infrastructure/controller/country/get-country.response';
import { countries as countriesExpected } from '#commands/country/countries';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';

describe('Get Countries', () => {
  let app: INestApplication;
  let httpServer: HttpServer;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
    await datasource.destroy();
  });

  it('should return countries', async () => {
    const response = await request(httpServer).get('/country').expect(200);

    const receivedCountries: CountryResponse[] = response.body;

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
});
