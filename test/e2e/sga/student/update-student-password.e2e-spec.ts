import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { UpdateStudentPasswordE2eSeed } from '#test/e2e/sga/student/update-student-password-e2e-seeds';

const path = `/student/${UpdateStudentPasswordE2eSeed.existingStudentId}/password`;

describe('/student/:id/password (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new UpdateStudentPasswordE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        UpdateStudentPasswordE2eSeed.superAdminUserEmail,
        UpdateStudentPasswordE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        UpdateStudentPasswordE2eSeed.adminUserEmail,
        UpdateStudentPasswordE2eSeed.adminUserPassword,
      ),
    ]);
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });
  it('should return forbidden', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });
  it('should return bad request (empty body)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });
  it('should update a password from a student', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        newPassword: 'Nueva.contras3na!',
      })
      .expect(200);
  });
  it('should throw a InvalidPasswordException', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        newPassword: 'hola',
      })
      .expect(400);
    expect(response.body.message).toEqual('sga.user.invalid_format_password');
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
