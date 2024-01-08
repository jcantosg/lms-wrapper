import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '&/ormconfig';
import supertest from 'supertest';
import { GetAllBusinessUnitsE2eSeed } from '#test/e2e/sga/business-unit/get-all-business-units.e2e-seed';
import { GetAllBusinessUnitsE2eSeedDataConfig } from './seed-data-config/get-all-business-units.e2e-seed-data-config';
import {
  FIRST_PAGE,
  DEFAULT_LIMIT,
} from '#/sga/shared/application/collection.query';

const path = '/business-unit';

describe('/business-unit', () => {
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

  it('should return business units with page and limit default', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      count: DEFAULT_LIMIT,
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

  it('should return business units empty with page 2 and limit default', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .query({
        page: 2,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: 2,
      count: DEFAULT_LIMIT,
      total: GetAllBusinessUnitsE2eSeedDataConfig.businessUnits.length,
    });

    expect(response.body.items).toEqual([]);
  });

  it('should return 400 when query field doest not exist', async () => {
    await supertest(httpServer)
      .get(path)
      .query({
        name2: 'test',
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });

  it('should return empty business units with isActive = false', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .query({
        isActive: false,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      count: DEFAULT_LIMIT,
      total: 0,
    });

    expect(response.body.items).toEqual([]);
  });

  it('should return business units with query param name', async () => {
    const name = 'val';
    const response = await supertest(httpServer)
      .get(path)
      .query({
        name,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const businessUnitsFilter =
      GetAllBusinessUnitsE2eSeedDataConfig.businessUnits.filter(
        (businessUnit) => businessUnit.name.toLowerCase().includes(name),
      );

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      count: DEFAULT_LIMIT,
      total: businessUnitsFilter.length,
    });

    const businessUnitsExpected = businessUnitsFilter.map((businessUnit) =>
      expect.objectContaining({
        id: businessUnit.id,
        name: businessUnit.name,
        code: businessUnit.code,
        isActive: true,
        country: expectCountryResponse(),
      }),
    );

    expect(response.body.items).toEqual(
      expect.arrayContaining(businessUnitsExpected),
    );
  });

  it('should return business units with query param name and query param code', async () => {
    const name = 'val';
    const code = 'bar';

    const response = await supertest(httpServer)
      .get(path)
      .query({
        name,
        code,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const businessUnitsFilter =
      GetAllBusinessUnitsE2eSeedDataConfig.businessUnits.filter(
        (businessUnit) =>
          businessUnit.name.toLowerCase().includes(name) &&
          businessUnit.name.toLowerCase().includes(code),
      );

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      count: DEFAULT_LIMIT,
      total: businessUnitsFilter.length,
    });

    const businessUnitsExpected = businessUnitsFilter.map((businessUnit) =>
      expect.objectContaining({
        id: businessUnit.id,
        name: businessUnit.name,
        code: businessUnit.code,
        isActive: true,
        country: expectCountryResponse(),
      }),
    );

    expect(response.body.items).toEqual(
      expect.arrayContaining(businessUnitsExpected),
    );
  });

  it('should return business units with query param code', async () => {
    const code = 'bar';
    const response = await supertest(httpServer)
      .get(path)
      .query({
        code,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const businessUnitsFilter =
      GetAllBusinessUnitsE2eSeedDataConfig.businessUnits.filter(
        (businessUnit) => businessUnit.name.toLowerCase().includes(code),
      );

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      count: DEFAULT_LIMIT,
      total: 1,
    });

    const businessUnitsExpected = businessUnitsFilter.map((businessUnit) =>
      expect.objectContaining({
        id: businessUnit.id,
        name: businessUnit.name,
        code: businessUnit.code,
        isActive: true,
        country: expectCountryResponse(),
      }),
    );

    expect(response.body.items).toEqual(
      expect.arrayContaining(businessUnitsExpected),
    );
  });

  it('should return business units with query param country', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .query({
        country: GetAllBusinessUnitsE2eSeedDataConfig.country.id,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      count: DEFAULT_LIMIT,
      total: GetAllBusinessUnitsE2eSeedDataConfig.businessUnits.length,
    });

    const businessUnitsExpected =
      GetAllBusinessUnitsE2eSeedDataConfig.businessUnits.map((businessUnit) =>
        expect.objectContaining({
          id: businessUnit.id,
          name: businessUnit.name,
          code: businessUnit.code,
          isActive: true,
          country: expectCountryResponse(),
        }),
      );

    expect(response.body.items).toEqual(
      expect.arrayContaining(businessUnitsExpected),
    );
  });

  it('should return order by name asc', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .query({
        orderBy: 'name',
        orderType: 'ASC',
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const businessUnitsExpected =
      GetAllBusinessUnitsE2eSeedDataConfig.businessUnits
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((businessUnit) =>
          expect.objectContaining({
            id: businessUnit.id,
            name: businessUnit.name,
            code: businessUnit.code,
            isActive: true,
            country: expectCountryResponse(),
          }),
        );

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      count: DEFAULT_LIMIT,
      total: businessUnitsExpected.length,
    });

    expect(response.body.items).toEqual(
      expect.arrayContaining(businessUnitsExpected),
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
