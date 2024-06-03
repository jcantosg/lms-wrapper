import { v4 as uuid } from 'uuid';
import { HttpServer } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { CreateAcademicPeriodE2eSeed } from '#test/e2e/sga/academic-offering/academic-period/create-academic-period.e2e-seeds';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';

const path = '/academic-period';

describe('/academic-period (POST)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new CreateAcademicPeriodE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        CreateAcademicPeriodE2eSeed.superAdminUserEmail,
        CreateAcademicPeriodE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        CreateAcademicPeriodE2eSeed.adminUserEmail,
        CreateAcademicPeriodE2eSeed.adminUserPassword,
      ),
    ]);
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).post(path).expect(401);
  });
  it('should return forbidden', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });
  it('should return bad request', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });
  it('should create an academic period', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateAcademicPeriodE2eSeed.academicPeriodId,
        name: CreateAcademicPeriodE2eSeed.academicPeriodName,
        code: CreateAcademicPeriodE2eSeed.academicPeriodCode,
        startDate: CreateAcademicPeriodE2eSeed.academicPeriodStartDate,
        endDate: CreateAcademicPeriodE2eSeed.academicPeriodEndDate,
        businessUnit: CreateAcademicPeriodE2eSeed.businessUnitId,
        periodBlocks: [
          {
            id: uuid(),
            name: 'name1',
            startDate: new Date(),
          },
          {
            id: uuid(),
            name: 'name2',
            startDate: new Date(),
          },
        ],
      })
      .expect(201);
  });
  it('should throw a duplicated code error', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateAcademicPeriodE2eSeed.thirdAcademicPeriodId,
        name: CreateAcademicPeriodE2eSeed.academicPeriodName,
        code: CreateAcademicPeriodE2eSeed.academicPeriodCode,
        startDate: CreateAcademicPeriodE2eSeed.academicPeriodStartDate,
        endDate: CreateAcademicPeriodE2eSeed.academicPeriodEndDate,
        businessUnit: CreateAcademicPeriodE2eSeed.businessUnitId,
        periodBlocks: [
          {
            id: uuid(),
            name: 'name5',
            startDate: new Date(),
          },
          {
            id: uuid(),
            name: 'name6',
            startDate: new Date(),
          },
        ],
      })
      .expect(409);
    expect(response.body.message).toEqual(
      'sga.academic-period.duplicated-code',
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
