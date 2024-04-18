import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import { EditProfileE2eSeed } from '#test/e2e/sga/admin-user/edit-profile.e2e-seeds';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';

const path = '/profile';

describe('/profile (PUT)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new EditProfileE2eSeed(datasource);
    await seeder.arrange();
    adminAccessToken = await login(
      httpServer,
      EditProfileE2eSeed.adminUserEmail,
      EditProfileE2eSeed.adminUserPassword,
    );
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });
  it('should return bad request (empty body)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });
  it('should update the profile', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .send({
        name: EditProfileE2eSeed.newName,
        surname: EditProfileE2eSeed.newSurname,
        surname2: EditProfileE2eSeed.newSurname2,
      })
      .expect(200);
  });
  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
