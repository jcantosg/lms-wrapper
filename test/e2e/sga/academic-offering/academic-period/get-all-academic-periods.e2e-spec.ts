import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import supertest from 'supertest';
import {
  DEFAULT_LIMIT,
  FIRST_PAGE,
} from '#/sga/shared/application/collection.query';
import { GetAllAcademicPeriodsE2eSeedDataConfig } from '#test/e2e/sga/academic-offering/academic-period/get-all-academic-periods.e2e-seed-data-config';
import { GetAllAcademicPeriodsE2eSeed } from '#test/e2e/sga/academic-offering/academic-period/get-all-academic-periods.e2e-seed';
import { formatDate } from '#shared/domain/service/date-formatter.service';

const path = '/academic-period';

describe('/academic-period', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
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

  it('should return academic periods with page and limit default', async () => {
    const response = await supertest(httpServer)
      .get(path)
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
            startDate: formatDate(academicPeriod.startDate),
            endDate: formatDate(academicPeriod.endDate),
            businessUnit: {
              id: GetAllAcademicPeriodsE2eSeedDataConfig.businessUnit.id,
              name: GetAllAcademicPeriodsE2eSeedDataConfig.businessUnit.name,
            },
          }),
      );
    expect(response.body.items).toEqual(expect.arrayContaining(expectedItems));
  });

  it('should return academic periods empty with page 2 and limit default', async () => {
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
      total: GetAllAcademicPeriodsE2eSeedDataConfig.academicPeriods.length,
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

  it('should return academic periods with query param name and query param code', async () => {
    const name = 'period_1';
    const code = 'PER01';

    const response = await supertest(httpServer)
      .get(path)
      .query({
        name,
        code,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const academicPeriodsFilter =
      GetAllAcademicPeriodsE2eSeedDataConfig.academicPeriods.filter(
        (examinationCenter) =>
          examinationCenter.name.includes(name) &&
          examinationCenter.code.includes(code),
      );

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: academicPeriodsFilter.length,
    });

    const academicPeriodsExpected = academicPeriodsFilter.map(
      (academicPeriod) =>
        expect.objectContaining({
          id: academicPeriod.id,
          name: academicPeriod.name,
          code: academicPeriod.code,
          startDate: formatDate(academicPeriod.startDate),
          endDate: formatDate(academicPeriod.endDate),
          businessUnit: {
            id: GetAllAcademicPeriodsE2eSeedDataConfig.businessUnit.id,
            name: GetAllAcademicPeriodsE2eSeedDataConfig.businessUnit.name,
          },
        }),
    );

    expect(response.body.items).toEqual(
      expect.arrayContaining(academicPeriodsExpected),
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

    const academicPeriodsExpected =
      GetAllAcademicPeriodsE2eSeedDataConfig.academicPeriods
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((academicPeriod) =>
          expect.objectContaining({
            id: academicPeriod.id,
            name: academicPeriod.name,
            code: academicPeriod.code,
            startDate: formatDate(academicPeriod.startDate),
            endDate: formatDate(academicPeriod.endDate),
            businessUnit: {
              id: GetAllAcademicPeriodsE2eSeedDataConfig.businessUnit.id,
              name: GetAllAcademicPeriodsE2eSeedDataConfig.businessUnit.name,
            },
          }),
        );

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: academicPeriodsExpected.length,
    });

    expect(response.body.items).toEqual(
      expect.arrayContaining(academicPeriodsExpected),
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
