import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { ExaminationCenterPostgresRepository } from '#business-unit/infrastructure/repository/examination-center.postgres-repository';
import { AddBusinessUnitsToExaminationCenterE2eSeeds } from '#test/e2e/sga/business-unit/examination-center/add-business-units-to-examination-center.e2e-seed';
import { HttpServer } from '@nestjs/common';
import { examinationCenterSchema } from '#business-unit/infrastructure/config/schema/examination-center.schema';

const path =
  '/examination-center/02096887-c100-4170-b470-1230b90bcbc4/add-business-unit';

describe('/examination-center/{id}/add-business-unit', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let superAdminAccessToken: string;
  let examinationCenterRepository: ExaminationCenterRepository;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new AddBusinessUnitsToExaminationCenterE2eSeeds(datasource);
    await seeder.arrange();
    [adminAccessToken, superAdminAccessToken] = await Promise.all([
      login(
        httpServer,
        AddBusinessUnitsToExaminationCenterE2eSeeds.adminUserEmail,
        AddBusinessUnitsToExaminationCenterE2eSeeds.adminUserPassword,
      ),
      login(
        httpServer,
        AddBusinessUnitsToExaminationCenterE2eSeeds.superAdminUserEmail,
        AddBusinessUnitsToExaminationCenterE2eSeeds.superAdminUserPassword,
      ),
    ]);
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

  it('Should throw a ExaminationCenterNotFoundException ', async () => {
    await supertest(httpServer)
      .put(
        '/examination-center/68d03278-df64-4afa-a482-89336197243e/add-business-unit',
      )
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        businessUnits: [
          AddBusinessUnitsToExaminationCenterE2eSeeds.businessUnitId,
        ],
      })
      .expect(404);
  });

  it('Should throw a BusinessUnitNotFoundException ', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        businessUnits: ['ab03f530-fab4-4b06-bf48-d2d3497df4ef'],
      })
      .expect(404);
  });

  it('Should return bad request when empty body', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });

  it('should add business unit to examination center', async () => {
    examinationCenterRepository = new ExaminationCenterPostgresRepository(
      datasource.getRepository(examinationCenterSchema),
    );

    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        businessUnits: [
          AddBusinessUnitsToExaminationCenterE2eSeeds.businessUnitId,
        ],
      })
      .expect(200);

    const examinationCenter = await examinationCenterRepository.get(
      '02096887-c100-4170-b470-1230b90bcbc4',
    );

    expect(examinationCenter?.businessUnits).toHaveLength(1);
    expect(examinationCenter?.businessUnits).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: AddBusinessUnitsToExaminationCenterE2eSeeds.businessUnitId,
          name: AddBusinessUnitsToExaminationCenterE2eSeeds.businessUnitName,
          code: AddBusinessUnitsToExaminationCenterE2eSeeds.businessUnitCode,
        }),
      ]),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
