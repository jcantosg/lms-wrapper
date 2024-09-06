import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { AddSubjectCallE2eSeed } from '#test/e2e/sga/student/subject-call/add-subject-call.e2e-seed';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { Repository } from 'typeorm';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { subjectCallSchema } from '#student/infrastructure/config/schema/subject-call.schema';
import { SubjectCallScheduleHistory } from '#student/domain/entity/subject-call-schedule-history.entity';
import { subjectCallScheduleHistorySchema } from '#student/infrastructure/config/schema/subject-call-schedule-history.schema';

const path = `/subject-call/batch`;

describe('/subject-call/batch (POST)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  let subjectCallRepository: Repository<SubjectCall>;
  let subjectCallScheduleHisotryRepository: Repository<SubjectCallScheduleHistory>;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new AddSubjectCallE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        AddSubjectCallE2eSeed.superAdminUserEmail,
        AddSubjectCallE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        AddSubjectCallE2eSeed.adminUserEmail,
        AddSubjectCallE2eSeed.adminUserPassword,
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

  it('should return bad request', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  it('should throw an BusinessUnitNotFoundException', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        businessUnitId: 'dd716f57-0609-4f53-96a7-e6231bc889af',
        academicPeriodId: 'dd716f57-0609-4f53-96a7-e6231bc889af',
        academicProgramIds: ['dd716f57-0609-4f53-96a7-e6231bc889af'],
      })
      .expect(404);

    expect(response.body.message).toBe('sga.business-unit.not-found');
  });

  it('should throw an AcademicPeriodNotFoundException', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        businessUnitId: AddSubjectCallE2eSeed.businessUnitId,
        academicPeriodId: 'dd716f57-0609-4f53-96a7-e6231bc889af',
        academicProgramIds: ['dd716f57-0609-4f53-96a7-e6231bc889af'],
      })
      .expect(404);

    expect(response.body.message).toBe('sga.academic-period.not-found');
  });

  it('should throw an InvalidAcademicPeriodException', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        businessUnitId: AddSubjectCallE2eSeed.businessUnitId,
        academicPeriodId: AddSubjectCallE2eSeed.invalidAcademicPeriodId,
        academicProgramIds: ['dd716f57-0609-4f53-96a7-e6231bc889af'],
      })
      .expect(409);

    expect(response.body.message).toBe('sga.academic-period.invalid');
  });

  it('should throw an AcademicProgramNotFoundException', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        businessUnitId: AddSubjectCallE2eSeed.businessUnitId,
        academicPeriodId: AddSubjectCallE2eSeed.academicPeriodId,
        academicProgramIds: ['dd716f57-0609-4f53-96a7-e6231bc889af'],
      })
      .expect(404);

    expect(response.body.message).toBe('sga.academic-program.not-found');
  });

  it('should throw an InvalidAcademicProgramException', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        businessUnitId: AddSubjectCallE2eSeed.businessUnitId,
        academicPeriodId: AddSubjectCallE2eSeed.academicPeriodId,
        academicProgramIds: [AddSubjectCallE2eSeed.invalidAcademicProgramId],
      })
      .expect(409);

    expect(response.body.message).toBe('sga.academic-program.invalid');
  });

  it('should create new subject calls', async () => {
    subjectCallRepository = datasource.getRepository(subjectCallSchema);
    subjectCallScheduleHisotryRepository = datasource.getRepository(
      subjectCallScheduleHistorySchema,
    );

    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        businessUnitId: AddSubjectCallE2eSeed.businessUnitId,
        academicPeriodId: AddSubjectCallE2eSeed.academicPeriodId,
        academicProgramIds: [AddSubjectCallE2eSeed.academicProgramId],
      })
      .expect(201);

    const subjectCalls = await subjectCallRepository.find({
      where: { enrollment: { id: AddSubjectCallE2eSeed.enrollmentId } },
    });
    const scScheduleHistory = await subjectCallScheduleHisotryRepository.find({
      where: {
        businessUnit: { id: AddSubjectCallE2eSeed.businessUnitId },
        academicPeriod: { id: AddSubjectCallE2eSeed.academicPeriodId },
        academicPrograms: { id: AddSubjectCallE2eSeed.academicProgramId },
      },
    });

    expect(subjectCalls.length).toBe(1);
    expect(scScheduleHistory.length).toBe(1);
  });
  afterAll(async () => {
    await seeder.clear();
  });
});
