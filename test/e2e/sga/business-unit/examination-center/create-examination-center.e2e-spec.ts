import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { CreateExaminationCenterE2eSeeds } from '#test/e2e/sga/business-unit/examination-center/create-examination-center.e2e-seeds';
import { HttpServer } from '@nestjs/common';

const path = '/examination-center';

describe('/examination-center (POST)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new CreateExaminationCenterE2eSeeds(datasource);
    await seeder.arrange();
    [adminAccessToken, superAdminAccessToken] = await Promise.all([
      login(
        httpServer,
        CreateExaminationCenterE2eSeeds.adminUserEmail,
        CreateExaminationCenterE2eSeeds.adminUserPassword,
      ),
      login(
        httpServer,
        CreateExaminationCenterE2eSeeds.superAdminUserEmail,
        CreateExaminationCenterE2eSeeds.superAdminUserPassword,
      ),
    ]);
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
  });
});
