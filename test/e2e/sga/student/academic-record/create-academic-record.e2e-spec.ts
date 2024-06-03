import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { CreateAcademicRecordE2eSeed } from '#test/e2e/sga/student/academic-record/create-academic-record.e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { academicRecordSchema } from '#student/infrastructure/config/schema/academic-record.schema';

const path = '/academic-record';

describe('/academic-record (POST)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new CreateAcademicRecordE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        CreateAcademicRecordE2eSeed.superAdminUserEmail,
        CreateAcademicRecordE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        CreateAcademicRecordE2eSeed.adminUserEmail,
        CreateAcademicRecordE2eSeed.adminUserPassword,
      ),
    ]);
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).post(path).expect(401);
  });

  it('should return forbidden', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('should return bad request (empty body)', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  it('should return 404 student not found', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: '0d65b8cf-8079-41d8-857d-e317f72384ba',
        businessUnitId: CreateAcademicRecordE2eSeed.businessUnitId,
        virtualCampusId: CreateAcademicRecordE2eSeed.virtualCampusId,
        studentId: '2ec15a34-cd35-40d9-9d0d-6c92dd99dbdd',
        academicPeriodId: CreateAcademicRecordE2eSeed.academicPeriodId,
        academicProgramId: CreateAcademicRecordE2eSeed.academicProgramId,
        academicRecordModality: AcademicRecordModalityEnum.ELEARNING,
        isModular: false,
      })
      .expect(404);

    expect(response.body.message).toEqual('sga.student.not-found');
  });

  it('should create an academic record', async () => {
    const repository = datasource.getRepository(academicRecordSchema);

    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateAcademicRecordE2eSeed.academicRecordId,
        businessUnitId: CreateAcademicRecordE2eSeed.businessUnitId,
        virtualCampusId: CreateAcademicRecordE2eSeed.virtualCampusId,
        studentId: CreateAcademicRecordE2eSeed.studentId,
        academicPeriodId: CreateAcademicRecordE2eSeed.academicPeriodId,
        academicProgramId: CreateAcademicRecordE2eSeed.academicProgramId,
        academicRecordModality: AcademicRecordModalityEnum.ELEARNING,
        isModular: false,
      })
      .expect(201);

    const academicRecord = await repository.findOne({
      where: { id: CreateAcademicRecordE2eSeed.academicRecordId },
    });

    expect(academicRecord?.id).toEqual(
      CreateAcademicRecordE2eSeed.academicRecordId,
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
