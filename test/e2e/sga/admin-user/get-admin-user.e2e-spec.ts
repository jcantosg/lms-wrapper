import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import supertest from 'supertest';
import { GetAdminUserE2eSeed } from '#test/e2e/sga/admin-user/get-admin-user.e2e-seeds';

const path = '/me';

describe('/me (GET)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetAdminUserE2eSeed(datasource);
    await seeder.arrange();
    adminAccessToken = await login(
      httpServer,
      GetAdminUserE2eSeed.email,
      GetAdminUserE2eSeed.password,
    );
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });
  it('should return user info', async () => {
    const adminUser = await supertest(httpServer)
      .get(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(200);
    expect(adminUser.body).toMatchObject(
      expect.objectContaining({
        id: GetAdminUserE2eSeed.id,
        name: 'name',
        roles: [GetAdminUserE2eSeed.role],
        businessUnits: [],
        avatar: 'avatar',
      }),
    );
  });
  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
