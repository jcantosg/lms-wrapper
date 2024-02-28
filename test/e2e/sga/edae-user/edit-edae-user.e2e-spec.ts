import { EditEdaeUserE2eSeed } from '#test/e2e/sga/edae-user/edit-edae-user.e2e-seeds';
import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';

const path = `/edae-user/${EditEdaeUserE2eSeed.edaeUserId}`;

describe('/edae-user/:id (PUT)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new EditEdaeUserE2eSeed(datasource);
    await seeder.arrange();
    adminAccessToken = await login(
      httpServer,
      EditEdaeUserE2eSeed.adminEmail,
      EditEdaeUserE2eSeed.adminPassword,
    );
    superAdminAccessToken = await login(
      httpServer,
      EditEdaeUserE2eSeed.superAdminEmail,
      EditEdaeUserE2eSeed.superAdminPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });

  it('should return forbidden', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });
  it('should throw bad request', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  it('should edit an edae user', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        name: EditEdaeUserE2eSeed.newEdaeUserName,
        surname1: EditEdaeUserE2eSeed.edaeUserSurname,
        identityDocument: {
          identityDocumentType: 'dni',
          identityDocumentNumber: '75756541S',
        },
        roles: [EdaeRoles.COORDINADOR_FCT],
        timeZone: TimeZoneEnum.GMT_PLUS_1,
        isRemote: true,
        location: EditEdaeUserE2eSeed.countryId,
      })
      .expect(200);
  });

  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
