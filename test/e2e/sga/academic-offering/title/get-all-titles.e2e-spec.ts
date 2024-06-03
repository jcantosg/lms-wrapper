import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { GetAllTitlesE2eSeed } from '#test/e2e/sga/academic-offering/title/get-all-titles.e2e-seed';
import { expectTitles } from '#test/e2e/sga/academic-offering/subject/helpers';

const path = '/title/';
describe('/title/ (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
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
  });
});
