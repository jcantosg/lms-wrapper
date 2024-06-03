import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { formatDate } from '#shared/domain/service/date-formatter.service';
import { GetAcademicPeriodDetailE2eSeed } from '#test/e2e/sga/academic-offering/academic-period/get-academic-period-detail.e2e-seed';

const path = `/academic-period/${GetAcademicPeriodDetailE2eSeed.academicPeriodId}`;

describe('Get Academic Period Detail (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminUserToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetAcademicPeriodDetailE2eSeed(datasource);
    await seeder.arrange();
    [superAdminUserToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        GetAcademicPeriodDetailE2eSeed.superAdminEmail,
        GetAcademicPeriodDetailE2eSeed.superAdminPassword,
      ),
      login(
        httpServer,
        GetAcademicPeriodDetailE2eSeed.adminEmail,
        GetAcademicPeriodDetailE2eSeed.adminPassword,
      ),
    ]);
  });

  it('Should return Unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('Should return forbidden (User not Superadmin)', async () => {
    await supertest(httpServer)
      .get(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('Should return a 404', async () => {
    await supertest(httpServer)
      .get('/academic-period/68d03278-df64-4afa-a482-89336197243e')
      .auth(superAdminUserToken, { type: 'bearer' })
      .expect(404);
  });

  it('Should return an academic period', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminUserToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: GetAcademicPeriodDetailE2eSeed.academicPeriodId,
        name: GetAcademicPeriodDetailE2eSeed.academicPeriodName,
        code: GetAcademicPeriodDetailE2eSeed.academicPeriodCode,
        startDate: formatDate(
          GetAcademicPeriodDetailE2eSeed.academicPeriodStartDate,
        ),
        endDate: formatDate(
          GetAcademicPeriodDetailE2eSeed.academicPeriodEndDate,
        ),
        businessUnit: {
          id: GetAcademicPeriodDetailE2eSeed.businessUnitId,
          name: GetAcademicPeriodDetailE2eSeed.businessUnitName,
        },
      }),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
