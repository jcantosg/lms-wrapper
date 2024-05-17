import { GetEnrollmentsByAcademicRecordE2eSeed } from '#test/e2e/sga/student/enrollment/get-enrollments-by-academic-record.e2e-seeds';
import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';

const path = `/academic-record/${GetEnrollmentsByAcademicRecordE2eSeed.academicRecordId}/enrollment`;
const wrongPath = `/academic-record/${GetEnrollmentsByAcademicRecordE2eSeed.academicPeriodId}/enrollment`;

describe('/academic-record/:id/enrollment', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetEnrollmentsByAcademicRecordE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetEnrollmentsByAcademicRecordE2eSeed.superAdminUserEmail,
      GetEnrollmentsByAcademicRecordE2eSeed.superAdminUserPassword,
    );
  });
  it('should throw unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });
  it('should throw AcademicRecordNotFound', async () => {
    const response = await supertest(httpServer)
      .get(wrongPath)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);

    expect(response.body.message).toEqual('sga.academic-record.not-found');
  });
  it('should return enrollments', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: GetEnrollmentsByAcademicRecordE2eSeed.enrollmentId,
        }),
      ]),
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});