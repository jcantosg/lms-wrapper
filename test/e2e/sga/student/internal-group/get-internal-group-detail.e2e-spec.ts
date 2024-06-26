import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { GetInternalGroupDetailE2eSeed } from '#test/e2e/sga/student/internal-group/get-internal-group-detail.e2e-seed';

const path = '/internal-group';

describe('/internal-group/detail/:id (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  const internalGroupId = GetInternalGroupDetailE2eSeed.internalGroupId;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetInternalGroupDetailE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken] = await Promise.all([
      login(
        httpServer,
        GetInternalGroupDetailE2eSeed.superAdminUserEmail,
        GetInternalGroupDetailE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        GetInternalGroupDetailE2eSeed.adminUserEmail,
        GetInternalGroupDetailE2eSeed.adminUserPassword,
      ),
    ]);
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(`${path}/${internalGroupId}`).expect(401);
  });

  it('should return 404 internal group not found', async () => {
    const response = await supertest(httpServer)
      .get(`${path}/f20f1c3e-e3e6-452d-b4cb-e6d4cb039dbd`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);

    expect(response.body.message).toEqual('sga.internal-group.not-found');
  });

  it('should return internal group detail', async () => {
    const response = await supertest(httpServer)
      .get(`${path}/${GetInternalGroupDetailE2eSeed.internalGroupId}`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toEqual({
      id: GetInternalGroupDetailE2eSeed.internalGroupId,
      code: GetInternalGroupDetailE2eSeed.internalGroupCode,
      subject: {
        id: GetInternalGroupDetailE2eSeed.subjectId,
        name: GetInternalGroupDetailE2eSeed.subjectName,
      },
      academicProgram: {
        id: GetInternalGroupDetailE2eSeed.academicProgramId,
        name: GetInternalGroupDetailE2eSeed.academicProgramName,
      },
      academicPeriod: {
        id: GetInternalGroupDetailE2eSeed.academicPeriodId,
        name: GetInternalGroupDetailE2eSeed.academicPeriodName,
      },
      businessUnit: {
        id: GetInternalGroupDetailE2eSeed.businessUnitId,
        name: GetInternalGroupDetailE2eSeed.businessUnitName,
      },
      startDate: new Date(response.body.startDate).toISOString(),
      isDefaultGroup: false,
      teachers: [],
    });
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
