import { DeleteEnrollmentE2eSeed } from '#test/e2e/sga/student/enrollment/delete-enrollment.e2e-seeds';
import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';

const path = `/enrollment/${DeleteEnrollmentE2eSeed.enrollmentId}`;
describe('/enrollment/:id (DELETE)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new DeleteEnrollmentE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      DeleteEnrollmentE2eSeed.superAdminUserEmail,
      DeleteEnrollmentE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      DeleteEnrollmentE2eSeed.adminUserEmail,
      DeleteEnrollmentE2eSeed.adminUserPassword,
    );
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).delete(path).expect(401);
  });
  it('should return forbidden', async () => {
    await supertest(httpServer)
      .delete(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });
  it('should return enrollment not found', async () => {
    const response = await supertest(httpServer)
      .delete(`/enrollment/${DeleteEnrollmentE2eSeed.adminUserId}`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);

    expect(response.body.message).toEqual('sga.enrollment.not-found');
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
