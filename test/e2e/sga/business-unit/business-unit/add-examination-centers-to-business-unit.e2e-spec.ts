import supertest from 'supertest';
import datasource from '#config/ormconfig';
import { INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import { login } from '#test/e2e/sga/e2e-auth-helper';

import { BusinessUnitPostgresRepository } from '#business-unit/infrastructure/repository/business-unit.postgres-repository';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { AddExaminationCentersToBusinessUnitE2eSeeds } from '#test/e2e/sga/business-unit/business-unit/add-examination-centers-to-business-unit.e2e-seed';

const path =
  '/business-unit/b8d48d2a-7bab-4ef9-b30a-9eebf75ccae5/add-examination-center';

describe('/business-unit/{id}/add-examination-center', () => {
  let app: INestApplication;
  let httpServer: any;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let superAdminAccessToken: string;
  let businessRepository: BusinessUnitRepository;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new AddExaminationCentersToBusinessUnitE2eSeeds(datasource);
    await seeder.arrange();
    adminAccessToken = await login(
      httpServer,
      AddExaminationCentersToBusinessUnitE2eSeeds.adminUserEmail,
      AddExaminationCentersToBusinessUnitE2eSeeds.adminUserPassword,
    );
    superAdminAccessToken = await login(
      httpServer,
      AddExaminationCentersToBusinessUnitE2eSeeds.superAdminUserEmail,
      AddExaminationCentersToBusinessUnitE2eSeeds.superAdminUserPassword,
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
        '/business-unit/68d03278-df64-4afa-a482-89336197243e/add-examination-center',
      )
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        examinationCenters: [
          AddExaminationCentersToBusinessUnitE2eSeeds.examinationCenterId,
        ],
      })
      .expect(404);
  });

  it('Should throw a ExaminationCenterNotFoundException ', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        examinationCenters: ['ab03f530-fab4-4b06-bf48-d2d3497df4ef'],
      })
      .expect(404);
  });

  it('Should return bad request when empty body', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });

  it('Should add examination centers to business unit', async () => {
    businessRepository = new BusinessUnitPostgresRepository(
      datasource.getRepository(businessUnitSchema),
    );

    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        examinationCenters: [
          AddExaminationCentersToBusinessUnitE2eSeeds.examinationCenterId,
        ],
      })
      .expect(200);

    const businessUnit = await businessRepository.get(
      'b8d48d2a-7bab-4ef9-b30a-9eebf75ccae5',
    );

    expect(businessUnit?.examinationCenters).toHaveLength(1);
    expect(businessUnit?.examinationCenters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: AddExaminationCentersToBusinessUnitE2eSeeds.examinationCenterId,
          name: AddExaminationCentersToBusinessUnitE2eSeeds.examinationCenterName,
          code: AddExaminationCentersToBusinessUnitE2eSeeds.examinationCenterCode,
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
