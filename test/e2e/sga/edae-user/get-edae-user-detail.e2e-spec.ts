import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { GetEdaeUserDetailE2eSeed } from '#test/e2e/sga/edae-user/get-edae-user-detail.e2e-seed';

const path = `/edae-user/${GetEdaeUserDetailE2eSeed.edaeUserId}`;

describe('Get Edae User Detail (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminUserToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetEdaeUserDetailE2eSeed(datasource);
    await seeder.arrange();
    superAdminUserToken = await login(
      httpServer,
      GetEdaeUserDetailE2eSeed.superAdminEmail,
      GetEdaeUserDetailE2eSeed.superAdminPassword,
    );
  });

  it('Should return Unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
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
        identityDocument:
          GetEdaeUserDetailE2eSeed.edaeUserIdentityDocument.value,
      }),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
