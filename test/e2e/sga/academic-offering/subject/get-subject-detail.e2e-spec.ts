import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import supertest from 'supertest';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { GetSubjectDetailE2eSeed } from '#test/e2e/sga/academic-offering/subject/get-subject-detail.e2e-seed';

const path = `/subject/${GetSubjectDetailE2eSeed.subjectId}`;

describe('Get Subject Detail (GET)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminUserToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetSubjectDetailE2eSeed(datasource);
    await seeder.arrange();
    superAdminUserToken = await login(
      httpServer,
      GetSubjectDetailE2eSeed.superAdminEmail,
      GetSubjectDetailE2eSeed.superAdminPassword,
    );
  });

  it('Should return Unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('Should return a 404', async () => {
    await supertest(httpServer)
      .get('/subject/68d03278-df64-4afa-a482-89336197243e')
      .auth(superAdminUserToken, { type: 'bearer' })
      .expect(404);
  });

  it('Should return a subject', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminUserToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: GetSubjectDetailE2eSeed.subjectId,
        name: GetSubjectDetailE2eSeed.subjectName,
        code: GetSubjectDetailE2eSeed.subjectCode,
        officialCode: GetSubjectDetailE2eSeed.subjectOfficialCode,
        image: GetSubjectDetailE2eSeed.subjectImage,
        modality: GetSubjectDetailE2eSeed.subjectModality,
        type: GetSubjectDetailE2eSeed.subjectType,
        isRegulated: GetSubjectDetailE2eSeed.subjectIsRegulated,
      }),
    );
  });

  afterAll(async () => {
    await app.close();
    await seeder.clear();
    await datasource.destroy();
  });
});
