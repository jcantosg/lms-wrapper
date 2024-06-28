import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { loginStudent } from '#test/e2e/sga/e2e-auth-helper';
import { GetStudentAcademicRecordE2eSeed } from '#test/e2e/student-360/academic-record/get-student-academic-record.e2e-seed';

const path = `/student-360/academic-record`;

describe('/student-360/academic-record (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let studentToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetStudentAcademicRecordE2eSeed(datasource);
    await seeder.arrange();
    studentToken = await loginStudent(
      httpServer,
      GetStudentAcademicRecordE2eSeed.studentUniversaeEmail,
      GetStudentAcademicRecordE2eSeed.studentPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return all student academic records', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(studentToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: GetStudentAcademicRecordE2eSeed.academicRecordId,
          name: GetStudentAcademicRecordE2eSeed.titleName,
        }),
      ]),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
