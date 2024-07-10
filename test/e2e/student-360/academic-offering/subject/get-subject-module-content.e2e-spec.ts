import { GetSubjectE2eSeed } from '#test/e2e/student-360/academic-offering/subject/get-subject.e2e-seeds';
import { HttpServer } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { loginStudent } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { GetSubjectModuleE2eSeed } from '#test/e2e/student-360/academic-offering/subject/get-subject-module-content.e2e-seeds';

const path = `/wrapper/subject/${GetSubjectModuleE2eSeed.subjectId}/content/51302`;

describe('/wrapper/subject/:id/content/:id (GET)', () => {
  let httpServer: HttpServer;
  let studentToken: string;
  let seeder: E2eSeed;
  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetSubjectModuleE2eSeed(datasource);
    await seeder.arrange();
    studentToken = await loginStudent(
      httpServer,
      GetSubjectE2eSeed.studentUniversaeEmail,
      GetSubjectE2eSeed.studentPassword,
    );
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });
  it('should return a content module', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(studentToken, { type: 'bearer' })
      .expect(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: 51302,
        name: 'Infografías',
      }),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
