import supertest from 'supertest';
import { INestApplication } from '@nestjs/common';
import { startApp } from '#test/e2e/e2e-helper';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { CreateBusinessUnitE2eSeed } from '#test/e2e/sga/business-unit/create-business-unit.e2e-seeds';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';

const path = `/business-unit`;

describe('/business-unit (POST)', () => {
  let app: INestApplication;
  let httpServer: any;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();

    seeder = new CreateBusinessUnitE2eSeed(datasource);
    await seeder.arrange();

    adminAccessToken = await login(
      httpServer,
      CreateBusinessUnitE2eSeed.adminUserEmail,
      CreateBusinessUnitE2eSeed.adminUserPassword,
    );

    superAdminAccessToken = await login(
      httpServer,
      CreateBusinessUnitE2eSeed.superAdminUserEmail,
      CreateBusinessUnitE2eSeed.superAdminUserPassword,
    );
  });

  it('Should return unauthorized (User not authenticated)', async () => {
    await supertest(httpServer).post(path).expect(401);
  });

  it('Should return forbidden (User not Superadmin)', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('Should throw BusinessUnitDuplicatedException', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateBusinessUnitE2eSeed.duplicatedBusinessUnitId,
        name: CreateBusinessUnitE2eSeed.duplicatedBusinessUnitName,
        code: CreateBusinessUnitE2eSeed.duplicatedBusinessUnitCode,
        countryId: CreateBusinessUnitE2eSeed.countryId,
      })
      .expect(409);
  });

  it('Should throw CountryNotFoundException', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: 'dc87e917-ea81-40de-b887-e6b3a1db23fd',
        name: 'New business unit name',
        code: 'New business unit code',
        countryId: '6d24da25-0a3c-48cd-8ec0-b8c8d9bfeda3',
      })
      .expect(404);
  });

  it('Should create a business unit', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateBusinessUnitE2eSeed.newBusinessUnitId,
        name: 'New business unit name',
        code: 'New business unit code',
        countryId: CreateBusinessUnitE2eSeed.countryId,
      })
      .expect(201);
    const businessUnitExpected = [
      {
        id: CreateBusinessUnitE2eSeed.newBusinessUnitId,
        name: 'New business unit name',
        code: 'New business unit code',
        country: {
          id: CreateBusinessUnitE2eSeed.countryId,
          name: 'Test Country',
          emoji: 'emoji',
        },
      },
    ];
    const response = await supertest(httpServer)
      .get('/me')
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);
    expect(response.body.businessUnits).toEqual(businessUnitExpected);
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
