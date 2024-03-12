import { EditSubjectE2eSeed } from '#test/e2e/sga/academic-offering/subject/edit-subject.e2e-seeds';
import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';

const path = `/subject/${EditSubjectE2eSeed.subjectId}`;

describe('/subject/:id (PUT)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new EditSubjectE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      EditSubjectE2eSeed.superAdminUserEmail,
      EditSubjectE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      EditSubjectE2eSeed.adminUserEmail,
      EditSubjectE2eSeed.adminUserPassword,
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
  it('should return bad request (empty body)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });
  it('should edit subject', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        name: EditSubjectE2eSeed.subjectName,
        code: EditSubjectE2eSeed.subjectCode,
        hours: EditSubjectE2eSeed.subjectHours,
        modality: EditSubjectE2eSeed.subjectModality,
        evaluationType: EditSubjectE2eSeed.subjectEvaluationType,
        type: EditSubjectE2eSeed.subjectType,
        isRegulated: EditSubjectE2eSeed.subjectIsRegulated,
        isCore: EditSubjectE2eSeed.subjectIsCore,
      })
      .expect(200);
  });
  it('should throw a SubjectDuplicatedCodeException', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        name: EditSubjectE2eSeed.subjectName,
        code: EditSubjectE2eSeed.secondSubjectCode,
        hours: EditSubjectE2eSeed.subjectHours,
        modality: EditSubjectE2eSeed.subjectModality,
        evaluationType: EditSubjectE2eSeed.subjectEvaluationType,
        type: EditSubjectE2eSeed.subjectType,
        isRegulated: EditSubjectE2eSeed.subjectIsRegulated,
        isCore: EditSubjectE2eSeed.subjectIsCore,
      })
      .expect(409);
    expect(response.body.message).toBe('sga.subject.duplicated-code');
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
