import { HttpServer } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import {
  DEFAULT_LIMIT,
  FIRST_PAGE,
} from '#/sga/shared/application/collection.query';
import { GetAllExaminationCentersE2eSeedDataConfig } from '#test/e2e/sga/business-unit/seed-data-config/get-all-examination-centers.e2e-seed-data-config';
import { GetAllExaminationCentersE2eSeed } from '#test/e2e/sga/business-unit/examination-center/get-all-examination-center.e2e-seed';

const path = '/examination-center';

describe('/examination-center', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  const expectBusinessUnitsResponse = () => {
    return expect.arrayContaining([
      expect.objectContaining({
        id: GetAllExaminationCentersE2eSeedDataConfig.businessUnit.id,
        name: GetAllExaminationCentersE2eSeedDataConfig.businessUnit.name,
      }),
    ]);
  };

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetAllExaminationCentersE2eSeed(datasource);
    await seeder.arrange();

    superAdminAccessToken = await login(
      httpServer,
      GetAllExaminationCentersE2eSeedDataConfig.superAdmin.email,
      GetAllExaminationCentersE2eSeedDataConfig.superAdmin.password,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return examination centers with page and limit default', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total:
        GetAllExaminationCentersE2eSeedDataConfig.examinationCenters.length,
    });

    const expectedItems =
      GetAllExaminationCentersE2eSeedDataConfig.examinationCenters.map(
        (examinationCenter) =>
          expect.objectContaining({
            id: examinationCenter.id,
            name: examinationCenter.name,
            code: examinationCenter.code,
            isActive: true,
            businessUnits: expectBusinessUnitsResponse(),
            address: examinationCenter.address,
          }),
      );
    expect(response.body.items).toEqual(expect.arrayContaining(expectedItems));
  });

  it('should return examination centers empty with page 2 and limit default', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .query({
        page: 2,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: 2,
      limit: DEFAULT_LIMIT,
      total:
        GetAllExaminationCentersE2eSeedDataConfig.examinationCenters.length,
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

  it('should return empty examination centers with isActive = false', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .query({
        isActive: false,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: 0,
    });

    expect(response.body.items).toEqual([]);
  });

  it('should return examination centers with query param name', async () => {
    const name = 'exCenter_1';
    const response = await supertest(httpServer)
      .get(path)
      .query({
        name,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const examinationCentersFilter =
      GetAllExaminationCentersE2eSeedDataConfig.examinationCenters.filter(
        (examinationCenter) => examinationCenter.name.includes(name),
      );

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: examinationCentersFilter.length,
    });

    const examinationCentersExpected = examinationCentersFilter.map(
      (examinationCenter) =>
        expect.objectContaining({
          id: examinationCenter.id,
          name: examinationCenter.name,
          code: examinationCenter.code,
          isActive: true,
          businessUnits: expectBusinessUnitsResponse(),
          address: examinationCenter.address,
        }),
    );

    expect(response.body.items).toEqual(
      expect.arrayContaining(examinationCentersExpected),
    );
  });

  it('should return examination centers with query param name and query param code', async () => {
    const name = 'exCenter_1';
    const code = 'EX01';

    const response = await supertest(httpServer)
      .get(path)
      .query({
        name,
        code,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const examinationCentersFilter =
      GetAllExaminationCentersE2eSeedDataConfig.examinationCenters.filter(
        (examinationCenter) =>
          examinationCenter.name.includes(name) &&
          examinationCenter.code.includes(code),
      );

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: examinationCentersFilter.length,
    });

    const examinationCentersExpected = examinationCentersFilter.map(
      (examinationCenter) =>
        expect.objectContaining({
          id: examinationCenter.id,
          name: examinationCenter.name,
          code: examinationCenter.code,
          isActive: true,
          businessUnits: expectBusinessUnitsResponse(),
          address: examinationCenter.address,
        }),
    );

    expect(response.body.items).toEqual(
      expect.arrayContaining(examinationCentersExpected),
    );
  });

  it('should return examination centers with query param country', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .query({
        country: GetAllExaminationCentersE2eSeedDataConfig.country.id,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total:
        GetAllExaminationCentersE2eSeedDataConfig.examinationCenters.length,
    });

    const examinationCentersExpected =
      GetAllExaminationCentersE2eSeedDataConfig.examinationCenters.map(
        (examinationCenter) =>
          expect.objectContaining({
            id: examinationCenter.id,
            name: examinationCenter.name,
            code: examinationCenter.code,
            isActive: true,
            businessUnits: expectBusinessUnitsResponse(),
            address: examinationCenter.address,
          }),
      );

    expect(response.body.items).toEqual(
      expect.arrayContaining(examinationCentersExpected),
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

    const examinationCentersExpected =
      GetAllExaminationCentersE2eSeedDataConfig.examinationCenters
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((examinationCenter) =>
          expect.objectContaining({
            id: examinationCenter.id,
            name: examinationCenter.name,
            code: examinationCenter.code,
            isActive: true,
            businessUnits: expectBusinessUnitsResponse(),
            address: examinationCenter.address,
          }),
        );

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: examinationCentersExpected.length,
    });

    expect(response.body.items).toEqual(
      expect.arrayContaining(examinationCentersExpected),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
