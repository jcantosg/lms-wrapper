import supertest from 'supertest';
import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { GetAllPlainExaminationCentersE2eSeed } from '#test/e2e/sga/business-unit/examination-center/get-all-plain-examination-centers.e2e-seed';

const path = '/examination-center/all';

describe('/examination-center/all', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetAllPlainExaminationCentersE2eSeed(datasource);
    await seeder.arrange();

    adminAccessToken = await login(
      httpServer,
      GetAllPlainExaminationCentersE2eSeed.adminUserEmail,
      GetAllPlainExaminationCentersE2eSeed.adminUserPassword,
    );

    superAdminAccessToken = await login(
      httpServer,
      GetAllPlainExaminationCentersE2eSeed.superAdminUserEmail,
      GetAllPlainExaminationCentersE2eSeed.superAdminUserPassword,
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

  it('should return all plain examination centers', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: GetAllPlainExaminationCentersE2eSeed.examinationCenterId,
          name: GetAllPlainExaminationCentersE2eSeed.examinationCenterName,
        }),
        expect.objectContaining({
          id: GetAllPlainExaminationCentersE2eSeed.secondExaminationCenterId,
          name: GetAllPlainExaminationCentersE2eSeed.secondExaminationCenterName,
        }),
      ]),
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
