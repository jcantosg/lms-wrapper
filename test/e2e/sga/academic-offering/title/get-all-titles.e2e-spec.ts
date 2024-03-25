import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import supertest from 'supertest';
import { GetAllTitlesE2eSeed } from '#test/e2e/sga/academic-offering/title/get-all-titles.e2e-seed';
import { expectTitles } from '#test/e2e/sga/academic-offering/subject/helpers';

const path = '/title/';
describe('/title/ (GET)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetAllTitlesE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetAllTitlesE2eSeed.superAdminUserMail,
      GetAllTitlesE2eSeed.superAdminUserPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return all titles', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .set('Authorization', `Bearer ${superAdminAccessToken}`)
      .expect(200);

    expect(response.body.items).toEqual(
      expect.arrayContaining(expectTitles(GetAllTitlesE2eSeed.arrayTitles)),
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
