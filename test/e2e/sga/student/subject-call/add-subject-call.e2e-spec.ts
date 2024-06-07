import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { AddSubjectCallE2eSeed } from '#test/e2e/sga/student/subject-call/add-subject-call.e2e-seed';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { Repository } from 'typeorm';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { subjectCallSchema } from '#student/infrastructure/config/schema/subject-call.schema';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';

const path = `/enrollment/${AddSubjectCallE2eSeed.enrollmentId}/add-subject-call`;

const firstCall = AddSubjectCallE2eSeed.subjectCallId;
const secondCall = '79034a31-d818-49d2-b469-fa970ce36be4';
const secondCallRC = '6e4a9a11-4401-40d6-be62-b2c8cd022ecd';
const thirdCall = 'b650b013-72a0-447f-81f7-37a2c0954dc6';

async function verifyGenerateNextCall(
  expectedCallNumber: number,
  subjectCallRepository: Repository<SubjectCall>,
  subjectCallId: string,
) {
  const subjectCall = await subjectCallRepository.findOne({
    where: {
      id: subjectCallId,
    },
  });

  expect(subjectCall?.callNumber).toBe(expectedCallNumber);
  expect(subjectCall?.finalGrade).toBe(SubjectCallFinalGradeEnum.ONGOING);
  expect(subjectCall?.status).toBe(SubjectCallStatusEnum.ONGOING);
}

describe('/enrollment/:id/add-subject-call (POST)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  let subjectCallRepository: Repository<SubjectCall>;

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

  it('should throw an EnrollmentNotFoundException', async () => {
    const response = await supertest(httpServer)
      .post('/enrollment/011ced40-6df0-4c02-b2e5-f149d392e289/add-subject-call')
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        subjectCallId: '553c57f2-9413-48ab-8eda-8a251a07d953',
      })
      .expect(404);

    expect(response.body.message).toBe('sga.enrollment.not-found');
  });

  it('should create a new subject call with callNumber 1', async () => {
    subjectCallRepository = datasource.getRepository(subjectCallSchema);

    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        subjectCallId: firstCall,
      })
      .expect(201);

    await verifyGenerateNextCall(
      1,
      subjectCallRepository,
      AddSubjectCallE2eSeed.subjectCallId,
    );
  });

  it('should throw an SubjectCallDuplicatedException', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        subjectCallId: firstCall,
      })
      .expect(409);

    expect(response.body.message).toBe('sga.subject-call.duplicated');
  });

  it('should throw an SubjectCallNotTaken', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        subjectCallId: secondCall,
      })
      .expect(409);

    expect(response.body.message).toBe('sga.subject-call.not-taken');
  });

  it('should create a new subject call with callNumber 2', async () => {
    const subjectCall = await subjectCallRepository.findOne({
      where: {
        id: firstCall,
      },
    });

    await subjectCallRepository.save({
      id: subjectCall?.id,
      finalGrade: SubjectCallFinalGradeEnum.FOUR,
      status: SubjectCallStatusEnum.NOT_PASSED,
    });

    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        subjectCallId: secondCall,
      })
      .expect(201);

    await verifyGenerateNextCall(2, subjectCallRepository, secondCall);
  });

  it('should throw an SubjectCallJustPasedException', async () => {
    const subjectCall = await subjectCallRepository.findOne({
      where: {
        id: secondCall,
      },
    });

    await subjectCallRepository.save({
      id: subjectCall?.id,
      finalGrade: SubjectCallFinalGradeEnum.FIVE,
      status: SubjectCallStatusEnum.PASSED,
    });

    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        subjectCallId: thirdCall,
      })
      .expect(409);

    expect(response.body.message).toBe('sga.subject-call.just-passed');
  });

  it('should create a new subject call with callNumber 2 with before call RC', async () => {
    const subjectCall = await subjectCallRepository.findOne({
      where: {
        id: secondCall,
      },
    });

    await subjectCallRepository.save({
      id: subjectCall?.id,
      finalGrade: SubjectCallFinalGradeEnum.RC,
      status: SubjectCallStatusEnum.RENOUNCED,
    });

    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        subjectCallId: secondCallRC,
      })
      .expect(201);

    await verifyGenerateNextCall(2, subjectCallRepository, secondCallRC);
  });

  it('should generate a third call with callNumber 3', async () => {
    const subjectCall = await subjectCallRepository.findOne({
      where: {
        id: secondCallRC,
      },
    });

    await subjectCallRepository.save({
      id: subjectCall?.id,
      finalGrade: SubjectCallFinalGradeEnum.FOUR,
      status: SubjectCallStatusEnum.NOT_PASSED,
    });

    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        subjectCallId: thirdCall,
      })
      .expect(201);

    await verifyGenerateNextCall(3, subjectCallRepository, thirdCall);
  });

  it('should throw an SubjectCallMaxReachedException', async () => {
    const subjectCall = await subjectCallRepository.findOne({
      where: {
        id: thirdCall,
      },
    });

    await subjectCallRepository.save({
      id: subjectCall?.id,
      finalGrade: SubjectCallFinalGradeEnum.FOUR,
      status: SubjectCallStatusEnum.NOT_PASSED,
    });

    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        subjectCallId: '7841cebb-a380-4c0a-814f-885a6b219e8f',
      })
      .expect(409);

    expect(response.body.message).toBe('sga.subject-call.max-reached');
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
