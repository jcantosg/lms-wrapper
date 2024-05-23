import supertest from 'supertest';
import datasource from '#config/ormconfig';
import { GetStudentAcademicRecordE2eSeed } from '#test/e2e/sga/student/academic-record/get-student-academic-record.e2e-seed';
import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';

describe('/academic-record/:id (GET)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let path: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetStudentAcademicRecordE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetStudentAcademicRecordE2eSeed.superAdminUserEmail,
      GetStudentAcademicRecordE2eSeed.superAdminUserPassword,
    );
    path = `/student/${GetStudentAcademicRecordE2eSeed.studentId}/academic-record`;
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return 404', async () => {
    const nonExistentId = '79300ce0-00a0-4c41-82a7-080daed5c247';
    await supertest(httpServer)
      .get(`/student/${nonExistentId}/academic-record`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);
  });

  it('should return a student academic record', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toEqual([
      {
        id: GetStudentAcademicRecordE2eSeed.academicRecordId,
        title: GetStudentAcademicRecordE2eSeed.titleName,
        academicProgram: GetStudentAcademicRecordE2eSeed.academicProgramName,
        academicPeriod: GetStudentAcademicRecordE2eSeed.academicPeriodName,
        status: AcademicRecordStatusEnum.VALID,
      },
    ]);
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
