import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { GetAdminUserE2eSeed } from '#test/e2e/sga/admin-user/get-admin-user.e2e-seeds';

const path = '/me';

describe('/me (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;

  beforeAll(async () => {
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
  });
});
