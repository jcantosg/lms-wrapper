import { HttpServer, INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import datasource from '#config/ormconfig';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { GetAdministrativeGroupE2eSeed } from '#test/e2e/sga/student/administrative-group/get-administrative-group.e2e-seed';

const path = `/administrative-group/${GetAdministrativeGroupE2eSeed.administrativeGroupId}`;

describe('/administrative-group/:id (GET)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetAdministrativeGroupE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetAdministrativeGroupE2eSeed.superAdminUserEmail,
      GetAdministrativeGroupE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      GetAdministrativeGroupE2eSeed.adminUserEmail,
      GetAdministrativeGroupE2eSeed.adminUserPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return forbidden', async () => {
    await supertest(httpServer)
      .get(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('should throw an error when the administrative group does not exist', async () => {
    const response = await supertest(httpServer)
      .get(`/administrative-group/32b834e9-c09b-40bc-9d56-0b24568b28ef`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);

    expect(response.body.message).toEqual('sga.administrative-group.not-found');
  });

  it('should return an administrative group', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: GetAdministrativeGroupE2eSeed.administrativeGroupId,
        code: GetAdministrativeGroupE2eSeed.administrativeGroupCode,
        academicProgram: {
          id: GetAdministrativeGroupE2eSeed.academicProgramId,
          name: GetAdministrativeGroupE2eSeed.academicProgramName,
        },
        block: 1,
        academicPeriod: {
          id: GetAdministrativeGroupE2eSeed.academicPeriodId,
          name: GetAdministrativeGroupE2eSeed.academicPeriodName,
        },
        startMonth: 8,
        businessUnit: {
          id: GetAdministrativeGroupE2eSeed.businessUnitId,
          name: GetAdministrativeGroupE2eSeed.businessUnitName,
        },
        students: [],
        teachers: [],
      }),
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
