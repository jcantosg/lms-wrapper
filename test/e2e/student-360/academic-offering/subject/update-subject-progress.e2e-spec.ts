import { HttpServer } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { loginStudent } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { UpdateSubjectProgressE2Seed } from '#test/e2e/student-360/academic-offering/subject/update-subject-progress.e2e-seeds';

const path = `/student-360/subject-resource/${UpdateSubjectProgressE2Seed.courseModuleId}/progress`;

describe('/student-360/subject-resource/:id/progress (PUT)', () => {
  let httpServer: HttpServer;
  let studentToken: string;
  let seeder: E2eSeed;
  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new UpdateSubjectProgressE2Seed(datasource);
    await seeder.arrange();
    studentToken = await loginStudent(
      httpServer,
      UpdateSubjectProgressE2Seed.studentUniversaeEmail,
      UpdateSubjectProgressE2Seed.studentPassword,
    );
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });
  it('should return a progress', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(studentToken, { type: 'bearer' })
      .expect(200);
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
