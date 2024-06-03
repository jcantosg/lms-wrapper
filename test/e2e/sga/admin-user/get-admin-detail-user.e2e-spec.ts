import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { GetAdminDetailUserE2eSeed } from './get-admin-detail-user.e2e-seed';
import { IdentityDocumentType } from '#/sga/shared/domain/value-object/identity-document';

const path = `/admin-user/${GetAdminDetailUserE2eSeed.newAdminId}`;

describe('Get Admin Detail User (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminUserToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetAdminDetailUserE2eSeed(datasource);
    await seeder.arrange();
    [superAdminUserToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        GetAdminDetailUserE2eSeed.email,
        GetAdminDetailUserE2eSeed.password,
      ),
      login(
        httpServer,
        GetAdminDetailUserE2eSeed.newAdminEmail,
        GetAdminDetailUserE2eSeed.newAdminPassword,
      ),
    ]);
  });

  it('Should return Unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('Should return forbidden (User not Superadmin)', async () => {
    await supertest(httpServer)
      .get(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('Should return a 404', async () => {
    await supertest(httpServer)
      .get('/admin-user/68d03278-df64-4afa-a482-89336197243e')
      .auth(superAdminUserToken, { type: 'bearer' })
      .expect(404);
  });

  it('Should return an admin user', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminUserToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: GetAdminDetailUserE2eSeed.newAdminId,
        email: GetAdminDetailUserE2eSeed.newAdminEmail,
        roles: GetAdminDetailUserE2eSeed.newAdminRoles,
        name: 'name',
        surname: 'surname',
        surname2: 'surname2',
        avatar: 'avatar',
        businessUnits: [
          {
            id: GetAdminDetailUserE2eSeed.newAdminBusinessUnits[0],
            name: 'Madrid',
          },
        ],
        identityDocument: {
          identityDocumentType: IdentityDocumentType.DNI,
          identityDocumentNumber: '74700994F',
        },
      }),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
