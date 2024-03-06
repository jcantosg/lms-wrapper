import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import { CreateAcademicPeriodE2eSeed } from '#test/e2e/sga/academic-period/create-academic-period.e2e-seeds';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';

const path = '/academic-period';

describe('/academic-period (POST)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new CreateAcademicPeriodE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      CreateAcademicPeriodE2eSeed.superAdminUserEmail,
      CreateAcademicPeriodE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      CreateAcademicPeriodE2eSeed.adminUserEmail,
      CreateAcademicPeriodE2eSeed.adminUserPassword,
    );
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
        examinationCalls: [
          {
            id: CreateAcademicPeriodE2eSeed.examinationCallId,
            name: CreateAcademicPeriodE2eSeed.examinationCallName,
            startDate: CreateAcademicPeriodE2eSeed.examinationCallStartDate,
            endDate: CreateAcademicPeriodE2eSeed.examinationCallEndDate,
            timezone: CreateAcademicPeriodE2eSeed.examinationCallTimeZone,
          },
        ],
        blocksNumber: 2,
      })
      .expect(201);
  });
  it('should have at least one examination call on the body', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateAcademicPeriodE2eSeed.secondAcademicPeriodId,
        name: CreateAcademicPeriodE2eSeed.academicPeriodName,
        code: CreateAcademicPeriodE2eSeed.secondAcademicPeriodCode,
        startDate: CreateAcademicPeriodE2eSeed.academicPeriodStartDate,
        endDate: CreateAcademicPeriodE2eSeed.academicPeriodEndDate,
        businessUnit: CreateAcademicPeriodE2eSeed.businessUnitId,
        examinationCalls: [],
        blocksNumber: 2,
      })
      .expect(409);
    expect(response.body.message).toEqual(
      'sga.academic-period.not-examination-calls',
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});