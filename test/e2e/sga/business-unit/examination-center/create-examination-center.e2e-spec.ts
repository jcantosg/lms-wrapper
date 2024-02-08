import { INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import datasource from '#config/ormconfig';
import supertest from 'supertest';
import { CreateExaminationCenterE2eSeeds } from '#test/e2e/sga/business-unit/examination-center/create-examination-center.e2e-seeds';

const path = '/examination-center';

describe('/examination-center (POST)', () => {
  let app: INestApplication;
  let httpServer: any;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new CreateExaminationCenterE2eSeeds(datasource);
    await seeder.arrange();
    adminAccessToken = await login(
      httpServer,
      CreateExaminationCenterE2eSeeds.adminUserEmail,
      CreateExaminationCenterE2eSeeds.adminUserPassword,
    );
    superAdminAccessToken = await login(
      httpServer,
      CreateExaminationCenterE2eSeeds.superAdminUserEmail,
      CreateExaminationCenterE2eSeeds.superAdminUserPassword,
    );
  });

  it('Should return Unauthorized', async () => {
    await supertest(httpServer).post(path).expect(401);
  });
  it('Should return forbidden (User not Superadmin)', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });
  it('Should create an Examination Center ', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateExaminationCenterE2eSeeds.newExaminationCenterId,
        name: 'New Examination Center name',
        code: 'New Examination Center code',
        businessUnits: [],
        address: 'New Examination Center address',
        countryId: CreateExaminationCenterE2eSeeds.countryId,
      })
      .expect(201);
  });
  it('Should throw a BusinessUnitNotFoundException ', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateExaminationCenterE2eSeeds.businessNotFoundExceptionExaminationCenterId,
        name: 'New Examination Center name business',
        code: 'New Examination Center code business',
        businessUnits: ['9b498d9b-62e9-4558-9ec1-5be5b650279e'],
        address: 'New Examination Center address',
        countryId: CreateExaminationCenterE2eSeeds.countryId,
      })
      .expect(404);
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
