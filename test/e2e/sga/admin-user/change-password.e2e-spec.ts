import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { ChangePasswordE2eSeed } from '#test/e2e/sga/admin-user/change-password.e2e-seeds';

const path = '/profile/password';

describe('/profile/password (PUT)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new ChangePasswordE2eSeed(datasource);
    await seeder.arrange();
    adminAccessToken = await login(
      httpServer,
      ChangePasswordE2eSeed.adminUserEmail,
      ChangePasswordE2eSeed.adminUserPassword,
    );
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });
  it('should return bad request (empty body)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });
  it('should return invalid password', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .send({
        currentPassword: ChangePasswordE2eSeed.invalidCurrentPassword,
        newPassword: ChangePasswordE2eSeed.newPassword,
      })
      .expect(403);
  });
  it('should return invalid new password', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .send({
        currentPassword: ChangePasswordE2eSeed.adminUserPassword,
        newPassword: ChangePasswordE2eSeed.invalidNewPassword,
      })
      .expect(400);
  });
  it('should change password', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .send({
        currentPassword: ChangePasswordE2eSeed.adminUserPassword,
        newPassword: ChangePasswordE2eSeed.newPassword,
      })
      .expect(200);
  });
  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
