import { DeleteAdminUserE2eSeed } from '#test/e2e/sga/admin-user/delete-admin-user.e2e-seeds';
import { HttpServer, INestApplication } from '@nestjs/common';
import { startApp } from '#test/e2e/e2e-helper';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import datasource from '#config/ormconfig';

const path = `/admin-user/${DeleteAdminUserE2eSeed.adminUserId}`;
describe('/admin-user/:id (DELETE)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new DeleteAdminUserE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      DeleteAdminUserE2eSeed.superAdminUserEmail,
      DeleteAdminUserE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      DeleteAdminUserE2eSeed.adminUserEmail,
      DeleteAdminUserE2eSeed.adminUserPassword,
    );
  });
  it('Should return unauthorized (User not authenticated)', async () => {
    await supertest(httpServer).delete(path).expect(401);
  });

  it('Should return forbidden (User not Superadmin)', async () => {
    await supertest(httpServer)
      .delete(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });
  it('should delete an user', async () => {
    await supertest(httpServer)
      .delete(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);
  });
  it('should throw an AdminNotFoundException', async () => {
    await supertest(httpServer)
      .delete(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
