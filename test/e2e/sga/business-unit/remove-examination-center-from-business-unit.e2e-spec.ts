import supertest from 'supertest';
import datasource from '#config/ormconfig';
import { INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { RemoveExaminationCentersFromBusinessUnitE2eSeeds } from '#test/e2e/sga/business-unit/remove-examination-center-from-business-unit.e2e-seed';
import { BusinessUnitPostgresRepository } from '#business-unit/infrastructure/repository/business-unit.postgres-repository';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';

const path =
  '/business-unit/ab151b65-af1c-4e85-a939-a46ba4ed8095/remove-examination-center';

describe('/business-unit/{id}/remove-examination-center', () => {
  let app: INestApplication;
  let httpServer: any;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let superAdminAccessToken: string;
  let businessRepository: BusinessUnitRepository;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new RemoveExaminationCentersFromBusinessUnitE2eSeeds(datasource);
    await seeder.arrange();
    adminAccessToken = await login(
      httpServer,
      RemoveExaminationCentersFromBusinessUnitE2eSeeds.adminUserEmail,
      RemoveExaminationCentersFromBusinessUnitE2eSeeds.adminUserPassword,
    );
    superAdminAccessToken = await login(
      httpServer,
      RemoveExaminationCentersFromBusinessUnitE2eSeeds.superAdminUserEmail,
      RemoveExaminationCentersFromBusinessUnitE2eSeeds.superAdminUserPassword,
    );
  });

  it('Should return Unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });

  it('Should return forbidden (User not Superadmin)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('Should throw a BusinessUnitNotFoundException ', async () => {
    await supertest(httpServer)
      .put(
        '/business-unit/68d03278-df64-4afa-a482-89336197243e/remove-examination-center',
      )
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        examinationCenter:
          RemoveExaminationCentersFromBusinessUnitE2eSeeds.examinationCenterMainId,
      })
      .expect(404);
  });

  it('Should throw a ExaminationCenterNotFoundException ', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        examinationCenter: 'ab03f530-fab4-4b06-bf48-d2d3497df4ef',
      })
      .expect(404);
  });

  it('Should return bad request when empty body', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });

  it('Should throw a conflict exception when remove a main Examination Center', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        examinationCenter: '10bf8e4b-ac53-45b2-bc52-41ef206b065b',
      })
      .expect(409);
  });

  it('Should remove examination center from business unit', async () => {
    businessRepository = new BusinessUnitPostgresRepository(
      datasource.getRepository(businessUnitSchema),
    );

    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        examinationCenter:
          RemoveExaminationCentersFromBusinessUnitE2eSeeds.examinationCenterId,
      })
      .expect(200);

    const businessUnit = await businessRepository.get(
      'ab151b65-af1c-4e85-a939-a46ba4ed8095',
    );

    expect(businessUnit?.examinationCenters).toHaveLength(1);
    expect(businessUnit?.examinationCenters).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({
          id: RemoveExaminationCentersFromBusinessUnitE2eSeeds.examinationCenterId,
          name: RemoveExaminationCentersFromBusinessUnitE2eSeeds.examinationCenterName,
          code: RemoveExaminationCentersFromBusinessUnitE2eSeeds.examinationCenterCode,
        }),
      ]),
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
