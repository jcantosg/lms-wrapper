import { GetSubjectE2eSeed } from '#test/e2e/student-360/academic-offering/subject/get-subject.e2e-seeds';
import { HttpServer } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { loginStudent } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { GetSubjectProgressE2eSeed } from '#test/e2e/student-360/academic-offering/subject/get-subject-progress.e2e-seeds';

const path = `/student-360/subject/${GetSubjectProgressE2eSeed.subjectId}/progress`;

describe('/student-360/subject/:id/progress (GET)', () => {
  let httpServer: HttpServer;
  let studentToken: string;
  let seeder: E2eSeed;
  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetSubjectProgressE2eSeed(datasource);
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
  it('should return a progress', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(studentToken, { type: 'bearer' })
      .expect(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        progress: 5,
      }),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
