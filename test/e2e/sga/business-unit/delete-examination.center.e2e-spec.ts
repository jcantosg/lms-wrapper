import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import { DeleteExaminationCenterE2eSeeds } from '#test/e2e/sga/business-unit/delete-examination-center.e2e-seeds';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { GetAllBusinessUnitsE2eSeedDataConfig } from '#test/e2e/sga/business-unit/seed-data-config/get-all-business-units.e2e-seed-data-config';
import supertest from 'supertest';

const happyPath = `/examination-center/${DeleteExaminationCenterE2eSeeds.examinationCenterId}`;
const badPath = `/examination-center/${DeleteExaminationCenterE2eSeeds.mainExaminationCenterId}`;
describe('/examination-center/:id (DELETE)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new DeleteExaminationCenterE2eSeeds(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetAllBusinessUnitsE2eSeedDataConfig.superAdmin.email,
      GetAllBusinessUnitsE2eSeedDataConfig.superAdmin.password,
    );
  });
  it('should return an unauthorized error', async () => {
    await supertest(httpServer).delete(happyPath).expect(401);
  });
  it('should delete an examination center', async () => {
    await supertest(httpServer)
      .delete(happyPath)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    await supertest(httpServer)
      .get(happyPath)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);
  });
  it('should return a conflict error', async () => {
    await supertest(httpServer)
      .delete(badPath)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(409);
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
