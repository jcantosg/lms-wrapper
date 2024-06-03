import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { CreateEdaeUserE2eSeed } from '#test/e2e/sga/edae-user/create-edae-user.e2e-seeds';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';

const path = '/edae-user';

describe('/edae-user (POST)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new CreateEdaeUserE2eSeed(datasource);
    await seeder.arrange();
    [adminAccessToken, superAdminAccessToken] = await Promise.all([
      login(
        httpServer,
        CreateEdaeUserE2eSeed.adminUserMail,
        CreateEdaeUserE2eSeed.adminUserPassword,
      ),
      login(
        httpServer,
        CreateEdaeUserE2eSeed.superAdminUserMail,
        CreateEdaeUserE2eSeed.superAdminUserPassword,
      ),
    ]);
  });

  it('should create an edae user successfully', async () => {
    await supertest(httpServer)
      .post(path)
      .set('Authorization', `Bearer ${superAdminAccessToken}`)
      .send({
        id: CreateEdaeUserE2eSeed.newEdaeUserId,
        email: CreateEdaeUserE2eSeed.newEdaeUserEmail,
        name: CreateEdaeUserE2eSeed.newEdaeUserName,
        surname1: CreateEdaeUserE2eSeed.newEdaeUserSurname1,
        surname2: CreateEdaeUserE2eSeed.newEdaeUserSurname2,
        identityDocument: CreateEdaeUserE2eSeed.newEdaeUserIdentityDocument,
        roles: CreateEdaeUserE2eSeed.newEdaeUserRoles,
        businessUnits: CreateEdaeUserE2eSeed.newEdaeUserBusinessUnits,
        timeZone: CreateEdaeUserE2eSeed.newEdaeUserTimeZone,
        isRemote: CreateEdaeUserE2eSeed.newEdaeUserIsRemote,
        location: CreateEdaeUserE2eSeed.countryId,
      })
      .expect(201);
  });

  it('should return 400 if the body is empty', async () => {
    await supertest(httpServer)
      .post(path)
      .set('Authorization', `Bearer ${superAdminAccessToken}`)
      .send({})
      .expect(400);
  });

  it('should return 401 if not logged in', async () => {
    await supertest(httpServer).post(path).expect(401);
  });

  it('should return 403 if role is not allowed', async () => {
    await supertest(httpServer)
      .post(path)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        id: CreateEdaeUserE2eSeed.newEdaeUserId,
        email: CreateEdaeUserE2eSeed.newEdaeUserEmail,
        name: CreateEdaeUserE2eSeed.newEdaeUserName,
        surname1: CreateEdaeUserE2eSeed.newEdaeUserSurname1,
        surname2: CreateEdaeUserE2eSeed.newEdaeUserSurname2,
        identityDocument: CreateEdaeUserE2eSeed.newEdaeUserIdentityDocument,
        roles: CreateEdaeUserE2eSeed.newEdaeUserRoles,
        businessUnits: CreateEdaeUserE2eSeed.newEdaeUserBusinessUnits,
        timeZone: CreateEdaeUserE2eSeed.newEdaeUserTimeZone,
        isRemote: CreateEdaeUserE2eSeed.newEdaeUserIsRemote,
        location: CreateEdaeUserE2eSeed.countryId,
      })
      .expect(403);
  });

  it('should return 409 if the email is already used', async () => {
    await supertest(httpServer)
      .post(path)
      .set('Authorization', `Bearer ${superAdminAccessToken}`)
      .send({
        id: CreateEdaeUserE2eSeed.newEdaeUserId,
        email: CreateEdaeUserE2eSeed.newEdaeUserEmail,
        name: CreateEdaeUserE2eSeed.newEdaeUserName,
        surname1: CreateEdaeUserE2eSeed.newEdaeUserSurname1,
        surname2: CreateEdaeUserE2eSeed.newEdaeUserSurname2,
        identityDocument: CreateEdaeUserE2eSeed.newEdaeUserIdentityDocument,
        roles: CreateEdaeUserE2eSeed.newEdaeUserRoles,
        businessUnits: CreateEdaeUserE2eSeed.newEdaeUserBusinessUnits,
        timeZone: CreateEdaeUserE2eSeed.newEdaeUserTimeZone,
        isRemote: CreateEdaeUserE2eSeed.newEdaeUserIsRemote,
        location: CreateEdaeUserE2eSeed.countryId,
      })
      .expect(409);
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
