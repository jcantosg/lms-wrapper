import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { GetTitleDetailE2ESeed } from '#test/e2e/sga/academic-offering/title/get-title-detail.e2e-seed';

const path = `/title/${GetTitleDetailE2ESeed.titleId}`;

describe('/title/:id (GET)', () => {
  let httpServer: HttpServer;
  let seeder: GetTitleDetailE2ESeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
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
  });
});
