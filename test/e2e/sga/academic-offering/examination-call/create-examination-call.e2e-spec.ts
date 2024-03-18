import { INestApplication, HttpServer } from '@nestjs/common';
import { startApp } from '#test/e2e/e2e-helper';
import supertest from 'supertest';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import datasource from '#config/ormconfig';
import { CreateExaminationCallE2eSeed } from '#test/e2e/sga/academic-offering/examination-call/create-examination-call.e2e-seed';
import { E2eSeed } from '#test/e2e/e2e-seed';

const path = '/examination-call';

describe('/examination-call (POST)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let adminAccessToken: string;
  let superAdminAccessToken: string;
  let seeder: E2eSeed;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new CreateExaminationCallE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      CreateExaminationCallE2eSeed.superAdminUserMail,
      CreateExaminationCallE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      CreateExaminationCallE2eSeed.adminUserMail,
      CreateExaminationCallE2eSeed.adminUserPassword,
    );
  });

  it('should successfully create an examination call', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateExaminationCallE2eSeed.examinationCallId,
        name: CreateExaminationCallE2eSeed.examinationCallname,
        startDate: CreateExaminationCallE2eSeed.examinationCallstartDate,
        endDate: CreateExaminationCallE2eSeed.examinationCallEndDate,
        timezone: CreateExaminationCallE2eSeed.examinationCallTimeZone,
        academicPeriodId:
          CreateExaminationCallE2eSeed.examinationCallAcademicPeriodId,
      })
      .expect(201);
  });

  it('Should throw forbidden', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('should throw bad request (empty body)', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
    await seeder.clear();
    await datasource.destroy();
  });
});
