import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { IdentityDocumentType } from '#/sga/shared/domain/value-object/identity-document';
import { EditAdminUserE2eSeed } from '#test/e2e/sga/admin-user/edit-admin-user.e2e-seed';
import { AdminUserPostgresRepository } from '#admin-user/infrastructure/repository/admin-user.postgres-repository';
import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';

const path = `/admin-user/${EditAdminUserE2eSeed.newAdminId}`;

describe('Edit Admin User (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminUserToken: string;
  let adminAccessToken: string;
  let userAccessToken: string;
  let adminUserRepository: AdminUserPostgresRepository;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new EditAdminUserE2eSeed(datasource);
    await seeder.arrange();
    [superAdminUserToken, adminAccessToken, userAccessToken] =
      await Promise.all([
        login(
          httpServer,
          EditAdminUserE2eSeed.email,
          EditAdminUserE2eSeed.password,
        ),
        login(
          httpServer,
          EditAdminUserE2eSeed.newAdminEmail,
          EditAdminUserE2eSeed.newAdminPassword,
        ),
        login(
          httpServer,
          EditAdminUserE2eSeed.normalUserEmail,
          EditAdminUserE2eSeed.normalUserPassword,
        ),
      ]);
  });

  it('Should return Unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });

  it('Should return forbidden (User not Superadmin or Supervisor)', async () => {
    await supertest(httpServer)
      .get(path)
      .auth(userAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('Should return a user not found 404', async () => {
    const result = await supertest(httpServer)
      .get('/admin-user/68d03278-df64-4afa-a482-89336197243e')
      .auth(superAdminUserToken, { type: 'bearer' })
      .expect(404);

    expect(result.body).toMatchObject(
      expect.objectContaining({
        message: 'sga.admin-user.not-found',
      }),
    );
  });

  it('Should return a 403 role not permitted', async () => {
    const result = await supertest(httpServer)
      .put(`/admin-user/${EditAdminUserE2eSeed.id}`)
      .auth(adminAccessToken, { type: 'bearer' })
      .send({
        name: 'newName',
        surname: 'newSurname',
        surname2: 'newSecondSurname',
        identityDocument: {
          identityDocumentType: IdentityDocumentType.DNI,
          identityDocumentNumber: '74700994F',
        },
        roles: ['supervisor_jefatura'],
        avatar: 'http://www.test.com',
      })
      .expect(403);

    expect(result.body).toMatchObject(
      expect.objectContaining({
        message: 'sga.admin-user.not-allowed-roles',
      }),
    );
  });

  it('Should return a user updated', async () => {
    adminUserRepository = new AdminUserPostgresRepository(
      datasource.getRepository(adminUserSchema),
    );
    await supertest(httpServer)
      .put(path)
      .auth(superAdminUserToken, { type: 'bearer' })
      .send({
        name: 'newName',
        surname: 'newSurname',
        surname2: 'newSecondSurname',
        identityDocument: {
          identityDocumentType: IdentityDocumentType.DNI,
          identityDocumentNumber: '74700994F',
        },
        roles: ['supervisor_jefatura'],
        avatar: 'http://www.test.com',
      })
      .expect(200);

    const adminUser = await adminUserRepository.get(
      EditAdminUserE2eSeed.newAdminId,
    );

    expect(adminUser?.name).toEqual('newName');
    expect(adminUser?.surname).toEqual('newSurname');
    expect(adminUser?.surname2).toEqual('newSecondSurname');
    expect(adminUser?.identityDocument?.identityDocumentType).toEqual(
      IdentityDocumentType.DNI,
    );
    expect(adminUser?.identityDocument?.identityDocumentNumber).toEqual(
      '74700994F',
    );
    expect(adminUser?.roles).toEqual(['supervisor_jefatura']);
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
