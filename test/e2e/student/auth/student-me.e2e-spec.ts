import { HttpServer } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { StudentMeE2eSeed } from '#test/e2e/student/auth/student-me.e2e-seeds';
import { loginStudent } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';

const path = '/student-360/me';

let httpServer: HttpServer;
let seeder: E2eSeed;
let studentToken: string;

describe('/student-360/me (GET)', () => {
  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new StudentMeE2eSeed(datasource);
    await seeder.arrange();
    studentToken = await loginStudent(
      httpServer,
      StudentMeE2eSeed.studentUniversaeEmail,
      StudentMeE2eSeed.studentPassword,
    );
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });
  it('should return all student info', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(studentToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: StudentMeE2eSeed.studentId,
        name: StudentMeE2eSeed.studentName,
      }),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
