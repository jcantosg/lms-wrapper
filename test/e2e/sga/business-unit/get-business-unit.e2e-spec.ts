import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import supertest from 'supertest';
import { GetBusinessUnitE2eSeed } from '#test/e2e/sga/business-unit/get-business-unit.e2e-seeds';

const path = '/business-unit/35637f98-af93-456d-bde4-811ec48d4814';

describe('/business-unit/:id (GET)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;

  let superAdminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetBusinessUnitE2eSeed(datasource);
    await seeder.arrange();
    adminAccessToken = await login(
      httpServer,
      GetBusinessUnitE2eSeed.adminUserEmail,
      GetBusinessUnitE2eSeed.adminUserPassword,
    );
    superAdminAccessToken = await login(
      httpServer,
      GetBusinessUnitE2eSeed.superAdminUserEmail,
      GetBusinessUnitE2eSeed.superAdminUserPassword,
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
  it('should return a business unit', async () => {
    const businessUnit = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);
    expect(businessUnit.body).toMatchObject(
      expect.objectContaining({
        id: GetBusinessUnitE2eSeed.businessUnitId,
        name: GetBusinessUnitE2eSeed.businessUnitName,
        code: GetBusinessUnitE2eSeed.businessUnitCode,
        virtualCampuses: [],
        examinationCenters: [],
        country: {
          id: GetBusinessUnitE2eSeed.countryId,
          name: GetBusinessUnitE2eSeed.countryName,
          emoji: GetBusinessUnitE2eSeed.countryEmoji,
        },
      }),
    );
  });
  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
