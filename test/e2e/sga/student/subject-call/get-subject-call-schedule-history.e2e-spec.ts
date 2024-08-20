import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { SubjectCallScheduleHistoryE2eSeed } from '#test/e2e/sga/student/subject-call/get-subject-call-schedule-history.e2e-seed';

const path = '/subject-call-schedule-history';

describe('/subject-call-schedule-history (GET)', () => {
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
    await supertest(httpServer).get(`${path}?year=2024`).expect(401);
  });
  it('should return bad request', async () => {
    await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });
  it('should return empty items ', async () => {
    const response = await supertest(httpServer)
      .get(`${path}?year=${new Date().getFullYear() + 1}`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toEqual([]);
  });
  it('should return subject call schedule hisotry for the current year', async () => {
    const response = await supertest(httpServer)
      .get(`${path}?year=${new Date().getFullYear()}`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
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
          academicPeriodName:
            SubjectCallScheduleHistoryE2eSeed.academicPeriodName,
          academicProgramCount: 1,
        }),
      ]),
    );
  });
  afterAll(async () => {
    await seeder.clear();
  });
});
