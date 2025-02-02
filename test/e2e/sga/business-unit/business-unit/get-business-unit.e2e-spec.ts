import { HttpServer } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { GetBusinessUnitE2eSeed } from '#test/e2e/sga/business-unit/business-unit/get-business-unit.e2e-seeds';

const path = '/business-unit/35637f98-af93-456d-bde4-811ec48d4814';

describe('/business-unit/:id (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;

  let superAdminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetBusinessUnitE2eSeed(global.datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetBusinessUnitE2eSeed.superAdminUserEmail,
      GetBusinessUnitE2eSeed.superAdminUserPassword,
    );
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
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
  });
});
