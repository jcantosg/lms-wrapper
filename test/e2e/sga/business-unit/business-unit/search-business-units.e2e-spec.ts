import { HttpServer } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import {
  DEFAULT_LIMIT,
  FIRST_PAGE,
} from '#/sga/shared/application/collection.query';
import { GetAllBusinessUnitsE2eSeedDataConfig } from '#test/e2e/sga/business-unit/seed-data-config/get-all-business-units.e2e-seed-data-config';
import { GetAllBusinessUnitsE2eSeed } from '#test/e2e/sga/business-unit/business-unit/get-all-business-units.e2e-seed';

const path = '/business-unit/search';

describe('/business-unit/search', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  const expectCountryResponse = () => {
    return expect.objectContaining({
      id: GetAllBusinessUnitsE2eSeedDataConfig.country.id,
      name: GetAllBusinessUnitsE2eSeedDataConfig.country.name,
      emoji: GetAllBusinessUnitsE2eSeedDataConfig.country.emoji,
    });
  };

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetAllBusinessUnitsE2eSeed(datasource);
    await seeder.arrange();

    superAdminAccessToken = await login(
      httpServer,
      GetAllBusinessUnitsE2eSeedDataConfig.superAdmin.email,
      GetAllBusinessUnitsE2eSeedDataConfig.superAdmin.password,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return 400 when query field doest not exist', async () => {
    await supertest(httpServer)
      .get(path)
      .query({
        name: 'test',
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });

  it('should return 400 with empty query param', async () => {
    await supertest(httpServer)
      .get(path)
      .query({
        name: 'test',
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });

  it('should return business units with page and limit default and query param text', async () => {
    const value = 'test';
    const response = await supertest(httpServer)
      .get(path)
      .query({
        text: value,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: GetAllBusinessUnitsE2eSeedDataConfig.businessUnits.length,
    });

    const expectedItems =
      GetAllBusinessUnitsE2eSeedDataConfig.businessUnits.map((businessUnit) =>
        expect.objectContaining({
          id: businessUnit.id,
          name: businessUnit.name,
          code: businessUnit.code,
          isActive: true,
          country: expectCountryResponse(),
        }),
      );

    expect(response.body.items).toEqual(expect.arrayContaining(expectedItems));
  });

  it('should return business units with page and limit default and query param text', async () => {
    const value = 'val';
    const response = await supertest(httpServer)
      .get(path)
      .query({
        text: value,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: 1,
    });

    expect(response.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: GetAllBusinessUnitsE2eSeedDataConfig.businessUnits[0].id,
          name: GetAllBusinessUnitsE2eSeedDataConfig.businessUnits[0].name,
          code: GetAllBusinessUnitsE2eSeedDataConfig.businessUnits[0].code,
          isActive: true,
          country: expectCountryResponse(),
        }),
      ]),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
