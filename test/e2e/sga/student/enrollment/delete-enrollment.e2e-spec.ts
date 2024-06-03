import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { DeleteEnrollmentE2eSeed } from '#test/e2e/sga/student/enrollment/delete-enrollment.e2e-seeds';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';

const path = `/enrollment/${DeleteEnrollmentE2eSeed.enrollmentId}`;
describe('/enrollment/:id (DELETE)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new DeleteEnrollmentE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        DeleteEnrollmentE2eSeed.superAdminUserEmail,
        DeleteEnrollmentE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        DeleteEnrollmentE2eSeed.adminUserEmail,
        DeleteEnrollmentE2eSeed.adminUserPassword,
      ),
    ]);
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
  });
});
