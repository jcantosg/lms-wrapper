import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { EditSubjectE2eSeed } from '#test/e2e/sga/academic-offering/subject/edit-subject.e2e-seeds';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';

const path = `/subject/${EditSubjectE2eSeed.subjectId}`;

describe('/subject/:id (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new EditSubjectE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        EditSubjectE2eSeed.superAdminUserEmail,
        EditSubjectE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        EditSubjectE2eSeed.adminUserEmail,
        EditSubjectE2eSeed.adminUserPassword,
      ),
    ]);
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

  it('should throw invalid evaluation type exception', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        name: EditSubjectE2eSeed.subjectName,
        code: EditSubjectE2eSeed.subjectCode,
        hours: EditSubjectE2eSeed.subjectHours,
        modality: EditSubjectE2eSeed.subjectModality,
        evaluationType: EditSubjectE2eSeed.subjectEvaluationType,
        type: EditSubjectE2eSeed.subjectTypeSpecialty,
        isRegulated: EditSubjectE2eSeed.subjectIsRegulated,
        isCore: EditSubjectE2eSeed.subjectIsCore,
      })
      .expect(409);
    expect(response.body.message).toBe('sga.subject.invalid-evaluation-type');
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

  afterAll(async () => {
    await seeder.clear();
  });
});
