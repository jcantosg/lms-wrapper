import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import supertest from 'supertest';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { GetEdaeUserDetailE2eSeed } from '#test/e2e/sga/edae-user/get-edae-user-detail.e2e-seed';

const path = `/edae-user/${GetEdaeUserDetailE2eSeed.edaeUserId}`;

describe('Get Edae User Detail (GET)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminUserToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetEdaeUserDetailE2eSeed(datasource);
    await seeder.arrange();
    superAdminUserToken = await login(
      httpServer,
      GetEdaeUserDetailE2eSeed.superAdminEmail,
      GetEdaeUserDetailE2eSeed.superAdminPassword,
    );
    adminAccessToken = await login(
      httpServer,
      GetEdaeUserDetailE2eSeed.adminEmail,
      GetEdaeUserDetailE2eSeed.adminPassword,
    );
  });

  it('Should return Unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('Should return 404 (User not in business units of edae user)', async () => {
    await supertest(httpServer)
      .get(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(404);
  });

  it('Should return a 404', async () => {
    await supertest(httpServer)
      .get('/edae-user/68d03278-df64-4afa-a482-89336197243e')
      .auth(superAdminUserToken, { type: 'bearer' })
      .expect(404);
  });

  it('Should return an edae user', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminUserToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: GetEdaeUserDetailE2eSeed.edaeUserId,
        email: GetEdaeUserDetailE2eSeed.edaeUserEmail,
        roles: GetEdaeUserDetailE2eSeed.edaeUserRoles,
        businessUnits: [
          {
            id: GetEdaeUserDetailE2eSeed.adminBusinessUnits[0],
            name: 'Madrid',
          },
        ],
        identityDocument: GetEdaeUserDetailE2eSeed.edaeUserIdentityDocument,
      }),
    );
  });

  afterAll(async () => {
    await app.close();
    await seeder.clear();
    await datasource.destroy();
  });
});
