import { HttpServer, INestApplication } from '@nestjs/common';
import { startApp } from '#test/e2e/e2e-helper';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import datasource from '#config/ormconfig';
import supertest from 'supertest';
import { GetTitleDetailE2ESeed } from '#test/e2e/sga/academic-offering/title/get-title-detail.e2e-seed';

const path = `/title/${GetTitleDetailE2ESeed.titleId}`;

describe('/title/:id (GET)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: GetTitleDetailE2ESeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetTitleDetailE2ESeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetTitleDetailE2ESeed.superAdminUserMail,
      GetTitleDetailE2ESeed.superAdminUserPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('Should return a 404', async () => {
    await supertest(httpServer)
      .get('/title/68d03278-df64-4afa-a482-89336197243e')
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);
  });

  it('should return the title details for a valid id', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .set('Authorization', `Bearer ${superAdminAccessToken}`)
      .expect(200);

    expect(response.body).toEqual({
      id: GetTitleDetailE2ESeed.titleId,
      name: GetTitleDetailE2ESeed.titleName,
      officialCode: GetTitleDetailE2ESeed.titleOfficialCode,
      officialTitle: GetTitleDetailE2ESeed.titleOfficialTitle,
      officialProgram: GetTitleDetailE2ESeed.titleOfficialProgram,
      businessUnit: {
        id: GetTitleDetailE2ESeed.businessUnitId,
        name: GetTitleDetailE2ESeed.businessUnitName,
      },
    });
  });

  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
