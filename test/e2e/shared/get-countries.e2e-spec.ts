import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '#/app.module';
import { CountryResponse } from '#shared/infrastructure/controller/country/get-country.response';
import { countries as countriesExpected } from '#commands/country/countries';

describe('Get Countries', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return countries', async () => {
    const response = await request(app.getHttpServer())
      .get('/country')
      .expect(200);

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
