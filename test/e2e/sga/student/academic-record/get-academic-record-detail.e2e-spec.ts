import supertest from 'supertest';
import datasource from '#config/ormconfig';

import { HttpServer, INestApplication } from '@nestjs/common';
import { startApp } from '#test/e2e/e2e-helper';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { EditAcademicRecordE2eSeed } from '#test/e2e/sga/student/academic-record/edit-academic-record.e2e-seed';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
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
    seeder = new EditAcademicRecordE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      EditAcademicRecordE2eSeed.superAdminUserEmail,
      EditAcademicRecordE2eSeed.superAdminUserPassword,
    );
    path = `/academic-record/${EditAcademicRecordE2eSeed.academicRecordId}`;
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return the academic record details', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: EditAcademicRecordE2eSeed.academicRecordId,
        title: EditAcademicRecordE2eSeed.titleName,
        businessUnit: EditAcademicRecordE2eSeed.businessUnitName,
        student: expect.objectContaining({
          id: EditAcademicRecordE2eSeed.studentId,
          name: EditAcademicRecordE2eSeed.studentName,
          surname: EditAcademicRecordE2eSeed.studentSurname,
          avatar: null,
          isActive: true || false,
        }),
        academicPeriod: EditAcademicRecordE2eSeed.academicPeriodName,
        academicProgram: EditAcademicRecordE2eSeed.academicProgramName,
        modality: AcademicRecordModalityEnum.ELEARNING,
        isModular: EditAcademicRecordE2eSeed.academicRecordIsModular,
        status: AcademicRecordStatusEnum.VALID,
        block: EditAcademicRecordE2eSeed.academicPeriodBlocksNumber,
      }),
    );
  });

  it('should return 404', async () => {
    const nonExistentId = '79300ce0-00a0-4c41-82a7-080daed5c247';
    await supertest(httpServer)
      .get(`/academic-record/${nonExistentId}`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
