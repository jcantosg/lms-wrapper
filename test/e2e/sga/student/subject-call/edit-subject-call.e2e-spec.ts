import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { EditSubjectCallE2eSeed } from '#test/e2e/sga/student/subject-call/edit-subject-call.e2e-seed';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { MonthEnum } from '#/sga/shared/domain/enum/month.enum';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import { Repository } from 'typeorm';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { subjectCallSchema } from '#student/infrastructure/config/schema/subject-call.schema';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';

const path = `/subject-call/${EditSubjectCallE2eSeed.subjectCallId}`;

describe('/subject-call/:id (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  let subjectCallRepository: Repository<SubjectCall>;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new EditSubjectCallE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        EditSubjectCallE2eSeed.superAdminUserEmail,
        EditSubjectCallE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        EditSubjectCallE2eSeed.adminUserEmail,
        EditSubjectCallE2eSeed.adminUserPassword,
      ),
    ]);
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });

  it('should return forbidden', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('should return bad request', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  it('should throw an SubjectCallNotFoundException', async () => {
    const response = await supertest(httpServer)
      .put(`/subject-call/4bc9aa97-c650-40e3-9ccb-edc3d7ec9015`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        month: MonthEnum.December,
        year: 2025,
        finalGrade: SubjectCallFinalGradeEnum.TEN,
      })
      .expect(404);
    expect(response.body.message).toEqual('sga.subject-call.not-found');
  });

  it('should edit a SubjectCall', async () => {
    subjectCallRepository = datasource.getRepository(subjectCallSchema);
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        month: MonthEnum.December,
        year: 2025,
        finalGrade: SubjectCallFinalGradeEnum.TWO,
      })
      .expect(200);

    const subjectCall = await subjectCallRepository.findOne({
      where: {
        id: EditSubjectCallE2eSeed.subjectCallId,
      },
    });

    expect(subjectCall?.finalGrade).toEqual(SubjectCallFinalGradeEnum.TWO);
    expect(subjectCall?.status).toEqual(SubjectCallStatusEnum.NOT_PASSED);
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
