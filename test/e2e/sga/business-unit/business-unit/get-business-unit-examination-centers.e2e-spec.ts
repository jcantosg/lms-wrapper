import { v4 as uuid } from 'uuid';
import { startApp } from '#test/e2e/e2e-helper';
import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import datasource from '#config/ormconfig';
import supertest from 'supertest';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { GetAllExaminationCentersE2eSeedDataConfig } from '#test/e2e/sga/business-unit/seed-data-config/get-all-examination-centers.e2e-seed-data-config';
import { GetAllExaminationCentersE2eSeed } from '#test/e2e/sga/business-unit/examination-center/get-all-examination-center.e2e-seed';

const path = `/business-unit/${GetAllExaminationCentersE2eSeedDataConfig.businessUnit.id}/examination-centers`;
const emptyPath = `/business-unit/${uuid()}/examination-centers`;

describe('/business-unit/:id/examination-centers (GET)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetAllExaminationCentersE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetAllExaminationCentersE2eSeedDataConfig.superAdmin.email,
      GetAllExaminationCentersE2eSeedDataConfig.superAdmin.password,
    );
  });

  it('should throw unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return an examination center array', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.length).toBe(2);
  });
  it('should return an empty array', async () => {
    const response = await supertest(httpServer)
      .get(emptyPath)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);

    expect(response.body.message).toBe(
      'sga.business-unit.business-unit-not-found',
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
