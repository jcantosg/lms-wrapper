import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { loginStudent } from '#test/e2e/sga/e2e-auth-helper';
import { GetStudentAcademicRecordDetailE2eSeed } from '#test/e2e/student-360/academic-record/get-student-academic-record-detail.e2e-seed';

const path = `/student-360/academic-record/${GetStudentAcademicRecordDetailE2eSeed.academicRecordId}`;
const wrongPath = `/student-360/academic-record/${GetStudentAcademicRecordDetailE2eSeed.academicPeriodId}`;

describe('/student-360/academic-record/:id (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let studentToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetStudentAcademicRecordDetailE2eSeed(datasource);
    await seeder.arrange();
    studentToken = await loginStudent(
      httpServer,
      GetStudentAcademicRecordDetailE2eSeed.studentUniversaeEmail,
      GetStudentAcademicRecordDetailE2eSeed.studentPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });
  it('should return AcademicRecordNotFound', async () => {
    const response = await supertest(httpServer)
      .get(wrongPath)
      .auth(studentToken, { type: 'bearer' })
      .expect(404);
    expect(response.body.message).toEqual('student.academic-record.not-found');
  });

  it('should return an academic record detail', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(studentToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: GetStudentAcademicRecordDetailE2eSeed.academicRecordId,
        blocks: expect.arrayContaining([
          expect.objectContaining({
            id: GetStudentAcademicRecordDetailE2eSeed.programBlockId,
            name:
              GetStudentAcademicRecordDetailE2eSeed.programBlockName ===
              'Bloque 0'
                ? 'Especialidades'
                : GetStudentAcademicRecordDetailE2eSeed.programBlockName,
            subjects: expect.arrayContaining([]),
          }),
        ]),
      }),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
