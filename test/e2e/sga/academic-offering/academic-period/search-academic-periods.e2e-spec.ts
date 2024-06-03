import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import {
  DEFAULT_LIMIT,
  FIRST_PAGE,
} from '#/sga/shared/application/collection.query';
import { GetAllAcademicPeriodsE2eSeedDataConfig } from '#test/e2e/sga/academic-offering/academic-period/get-all-academic-periods.e2e-seed-data-config';
import { GetAllAcademicPeriodsE2eSeed } from '#test/e2e/sga/academic-offering/academic-period/get-all-academic-periods.e2e-seed';

const path = '/academic-period/search';

describe('/academic-period/search', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetAllAcademicPeriodsE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetAllAcademicPeriodsE2eSeedDataConfig.superAdmin.email,
      GetAllAcademicPeriodsE2eSeedDataConfig.superAdmin.password,
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
        text: '',
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });

  it('should return academic periods with page and limit default and query param text', async () => {
    const value = 'period';
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
      total: GetAllAcademicPeriodsE2eSeedDataConfig.academicPeriods.length,
    });

    const expectedItems =
      GetAllAcademicPeriodsE2eSeedDataConfig.academicPeriods.map(
        (academicPeriod) =>
          expect.objectContaining({
            id: academicPeriod.id,
            name: academicPeriod.name,
            code: academicPeriod.code,
          }),
      );

    expect(response.body.items).toEqual(expect.arrayContaining(expectedItems));
  });

  it('should return academic periods with page and limit default and query param text', async () => {
    const value = 'period_1';
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
          id: GetAllAcademicPeriodsE2eSeedDataConfig.academicPeriods[0].id,
          name: GetAllAcademicPeriodsE2eSeedDataConfig.academicPeriods[0].name,
          code: GetAllAcademicPeriodsE2eSeedDataConfig.academicPeriods[0].code,
        }),
      ]),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
