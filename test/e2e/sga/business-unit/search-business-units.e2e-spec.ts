import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '&/config/ormconfig';
import supertest from 'supertest';
import { GetAllBusinessUnitsE2eSeed } from '#test/e2e/sga/business-unit/get-all-business-units.e2e-seed';
import { GetAllBusinessUnitsE2eSeedDataConfig } from './seed-data-config/get-all-business-units.e2e-seed-data-config';
import {
  FIRST_PAGE,
  DEFAULT_LIMIT,
} from '#/sga/shared/application/collection.query';

const path = '/business-unit/search';

describe('/business-unit/search', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let superAdminAccessToken: string;

  const expectCountryResponse = () => {
    return expect.objectContaining({
      id: GetAllBusinessUnitsE2eSeedDataConfig.country.id,
      name: GetAllBusinessUnitsE2eSeedDataConfig.country.name,
      emoji: GetAllBusinessUnitsE2eSeedDataConfig.country.emoji,
    });
  };

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetAllBusinessUnitsE2eSeed(datasource);
    await seeder.arrange();
    adminAccessToken = await login(
      httpServer,
      GetAllBusinessUnitsE2eSeedDataConfig.admin.email,
      GetAllBusinessUnitsE2eSeedDataConfig.admin.password,
    );

    superAdminAccessToken = await login(
      httpServer,
      GetAllBusinessUnitsE2eSeedDataConfig.superAdmin.email,
      GetAllBusinessUnitsE2eSeedDataConfig.superAdmin.password,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return forbidden', async () => {
    await supertest(httpServer)
      .get(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
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
    await app.close();
    await datasource.destroy();
  });
});
