import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { GetStudentE2eSeed } from '#test/e2e/sga/student/get-student.e2e-seeds';
import { login } from '#test/e2e/sga/e2e-auth-helper';

const path = `/student`;

describe('/student (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetStudentE2eSeed(datasource);
    await seeder.arrange();
    adminAccessToken = await login(
      httpServer,
      GetStudentE2eSeed.superAdminUserEmail,
      GetStudentE2eSeed.superAdminUserPassword,
    );
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer)
      .get(`${path}/${GetStudentE2eSeed.studentId}`)
      .expect(401);
  });
  it('should return StudentNotFoundException', async () => {
    const response = await supertest(httpServer)
      .get(`${path}/${GetStudentE2eSeed.nonExistingStudentId}`)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(404);
    expect(response.body.message).toEqual('sga.student.not-found');
  });
  it('should return a student', async () => {
    const response = await supertest(httpServer)
      .get(`${path}/${GetStudentE2eSeed.studentId}`)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(200);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: GetStudentE2eSeed.studentId,
        name: GetStudentE2eSeed.studentName,
        surname: GetStudentE2eSeed.studentSurname,
        surname2: GetStudentE2eSeed.studentSurname2,
        email: GetStudentE2eSeed.studentEmail,
        universaeEmail: GetStudentE2eSeed.studentUniversaeEmail,
      }),
    );
  });
  afterAll(async () => {
    await seeder.clear();
  });
});
