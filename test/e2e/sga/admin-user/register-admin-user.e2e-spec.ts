import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { RegisterAdminUserE2eSeed } from '#test/e2e/sga/admin-user/register-admin-user.e2e-seeds';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { AdminUserPostgresRepository } from '#admin-user/infrastructure/repository/admin-user.postgres-repository';
import { v4 as uuid } from 'uuid';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';

const path = '/auth/register';

describe('Register User (POST)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminUserToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new RegisterAdminUserE2eSeed(datasource);
    await seeder.arrange();
    superAdminUserToken = await login(
      httpServer,
      RegisterAdminUserE2eSeed.email,
      RegisterAdminUserE2eSeed.password,
    );
  });
  it('should register an admin user', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminUserToken, { type: 'bearer' })
      .send({
        id: RegisterAdminUserE2eSeed.newAdminId,
        email: RegisterAdminUserE2eSeed.newAdminEmail,
        roles: RegisterAdminUserE2eSeed.newAdminRoles,
        name: RegisterAdminUserE2eSeed.newAdminName,
        avatar: RegisterAdminUserE2eSeed.newAdminAvatar,
        businessUnits: RegisterAdminUserE2eSeed.newAdminBusinessUnits,
        surname: RegisterAdminUserE2eSeed.newAdminSurname,
        surname2: RegisterAdminUserE2eSeed.newAdminSurname2,
        identityDocument: RegisterAdminUserE2eSeed.newIdentityDocument,
      })
      .expect(201);

    const adminUserGetter = new AdminUserGetter(
      new AdminUserPostgresRepository(
        datasource.getRepository(adminUserSchema),
      ),
    );
    const adminUser = adminUserGetter.get(RegisterAdminUserE2eSeed.newAdminId);
    expect(adminUser).not.toBeNull();
  });
  it('should throw duplicated email', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminUserToken, { type: 'bearer' })
      .send({
        id: uuid(),
        email: RegisterAdminUserE2eSeed.newAdminEmail,
        roles: RegisterAdminUserE2eSeed.newAdminRoles,
        name: RegisterAdminUserE2eSeed.newAdminName,
        avatar: RegisterAdminUserE2eSeed.newAdminAvatar,
        businessUnits: RegisterAdminUserE2eSeed.newAdminBusinessUnits,
        surname: RegisterAdminUserE2eSeed.newAdminSurname,
        surname2: RegisterAdminUserE2eSeed.newAdminSurname2,
        identityDocument: RegisterAdminUserE2eSeed.newIdentityDocument,
      })
      .expect(409);
  });

  it('should throw invalid document', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminUserToken, { type: 'bearer' })
      .send({
        id: uuid(),
        email: 'test@universae.com',
        roles: RegisterAdminUserE2eSeed.newAdminRoles,
        name: RegisterAdminUserE2eSeed.newAdminName,
        avatar: RegisterAdminUserE2eSeed.newAdminAvatar,
        businessUnits: RegisterAdminUserE2eSeed.newAdminBusinessUnits,
        surname: RegisterAdminUserE2eSeed.newAdminSurname,
        surname2: RegisterAdminUserE2eSeed.newAdminSurname2,
        identityDocument: {
          identityDocumentType: 'wrong_type',
          identityDocumentNumber: '66482882W',
        },
      })
      .expect(400);
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
