import { GetSubjectE2eSeed } from '#test/e2e/student-360/academic-offering/subject/get-subject.e2e-seeds';
import { HttpServer } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { loginStudent } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';

const path = `/student-360/academic-record/${GetSubjectE2eSeed.academicRecordId}/subject/${GetSubjectE2eSeed.subjectId}`;
const nonEnrolledSubjectPath = `/student-360/academic-record/${GetSubjectE2eSeed.academicRecordId}/subject/${GetSubjectE2eSeed.nonEnrolledSubjectId}`;

describe('/student-360/academic-record/:id/subject/:id (GET)', () => {
  let httpServer: HttpServer;
  let studentToken: string;
  let seeder: E2eSeed;
  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetSubjectE2eSeed(datasource);
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
  it('should return a subject', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(studentToken, { type: 'bearer' })
      .expect(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: GetSubjectE2eSeed.subjectId,
        name: GetSubjectE2eSeed.subjectName,
        lmsCourse: expect.objectContaining({
          modules: expect.objectContaining({
            resources: expect.arrayContaining([
              expect.objectContaining({
                name: 'Test',
                image: 'image.jpeg',
              }),
            ]),
            quizzes: expect.arrayContaining([]),
          }),
        }),
      }),
    );
  });
  it('should return a StudentSubjectNotFoundException', async () => {
    const response = await supertest(httpServer)
      .get(nonEnrolledSubjectPath)
      .auth(studentToken, { type: 'bearer' })
      .expect(404);
    expect(response.body.message).toEqual('student.subject.not-found');
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
