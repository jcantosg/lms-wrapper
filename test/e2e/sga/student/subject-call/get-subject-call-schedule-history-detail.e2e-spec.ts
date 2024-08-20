import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { SubjectCallScheduleHistoryE2eSeed } from '#test/e2e/sga/student/subject-call/get-subject-call-schedule-history.e2e-seed';

const path = `/subject-call-schedule-history/${SubjectCallScheduleHistoryE2eSeed.scshId}`;
const wrongPath = `/subject-call-schedule-history/123`;

describe('/subject-call-schedule-history/{{id}} (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new SubjectCallScheduleHistoryE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      SubjectCallScheduleHistoryE2eSeed.superAdminUserEmail,
      SubjectCallScheduleHistoryE2eSeed.superAdminUserPassword,
    );
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });
  it('should return bad request', async () => {
    await supertest(httpServer)
      .get(wrongPath)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });
  it('should return subject call schedule history not found exception', async () => {
    const response = await supertest(httpServer)
      .get(
        '/subject-call-schedule-history/28280f98-2067-4e9a-9407-6519c23fe51b',
      )
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);

    expect(response.body.message).toEqual(
      'sga.subject-call-schedule-history.not-found',
    );
  });
  it('should return subject call schedule hisotry', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        createdBy: {
          id: SubjectCallScheduleHistoryE2eSeed.superAdminUserId,
          name: 'name',
          surname: 'surname',
          surname2: 'surname2',
          avatar: 'avatar',
        },
        businessUnit: {
          id: SubjectCallScheduleHistoryE2eSeed.businessUnitId,
          name: SubjectCallScheduleHistoryE2eSeed.businessUnitName,
        },
        academicPeriod: {
          id: SubjectCallScheduleHistoryE2eSeed.academicPeriodId,
          name: SubjectCallScheduleHistoryE2eSeed.academicPeriodName,
          code: SubjectCallScheduleHistoryE2eSeed.academicPeriodCode,
        },
        academicPrograms: expect.arrayContaining([
          expect.objectContaining({
            id: SubjectCallScheduleHistoryE2eSeed.academicProgramId,
            name: SubjectCallScheduleHistoryE2eSeed.academicProgramName,
            code: SubjectCallScheduleHistoryE2eSeed.academicProgramCode,
          }),
        ]),
      }),
    );
  });
  afterAll(async () => {
    await seeder.clear();
  });
});
