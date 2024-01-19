import { HttpServer, INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { EditExaminationCenterE2eSeed } from '#test/e2e/sga/business-unit/edit-examination-center.e2e-seed';
import { examinationCenterSchema } from '#business-unit/infrastructure/config/schema/examination-center.schema';
import { ExaminationCenterPostgresRepository } from '#business-unit/infrastructure/repository/examination-center.postgres-repository';

const path = '/examination-center/7baf9fc5-8976-4780-aa07-c0dfb420e230';

describe('/examination-center/:id (PUT)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let superAdminAccessToken: string;
  let examinationCenterRepository: ExaminationCenterRepository;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new EditExaminationCenterE2eSeed(datasource);
    await seeder.arrange();
    adminAccessToken = await login(
      httpServer,
      EditExaminationCenterE2eSeed.adminUserEmail,
      EditExaminationCenterE2eSeed.adminUserPassword,
    );
    superAdminAccessToken = await login(
      httpServer,
      EditExaminationCenterE2eSeed.superAdminUserEmail,
      EditExaminationCenterE2eSeed.superAdminUserPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });

  it('should return forbidden', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('should return 404 when examination center does not exist', async () => {
    await supertest(httpServer)
      .put('/examination-center/ce3e994a-0bd0-4911-a0ec-48429a709284')
      .send({
        name: 'TestBusinessUnit',
        code: 'TestBusinessCode',
        businessUnits: [],
        address: 'test address',
        isActive: false,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);
  });

  it('should return bad request when empty body', async () => {
    await supertest(httpServer)
      .put(path)
      .send({})
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });

  it('should return 404 when business unit does not exist', async () => {
    await supertest(httpServer)
      .put(path)
      .send({
        name: 'TestBusinessUnit',
        code: 'TestBusinessCode',
        businessUnits: ['ce3e994a-0bd0-4911-a0ec-48429a709284'],
        address: 'test address',
        isActive: false,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);
  });

  it('should return 409 when duplicated examination center', async () => {
    await supertest(httpServer)
      .put(path)
      .send({
        name: 'TestExaminationCenter',
        code: EditExaminationCenterE2eSeed.secondExaminationCenterCode,
        businessUnits: [EditExaminationCenterE2eSeed.businessUnitId],
        address: 'test address',
        isActive: false,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(409);
  });

  it('should edit the examination center', async () => {
    examinationCenterRepository = new ExaminationCenterPostgresRepository(
      datasource.getRepository(examinationCenterSchema),
    );

    await supertest(httpServer)
      .put(path)
      .send({
        name: 'TestExaminationCenterUnit',
        code: 'TestExaminationCenterCode',
        businessUnits: [EditExaminationCenterE2eSeed.businessUnitId],
        address: 'test address',
        isActive: false,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const examinationCenter = await examinationCenterRepository.get(
      EditExaminationCenterE2eSeed.examinationCenterId,
    );

    expect(examinationCenter?.name).toBe('TestExaminationCenterUnit');
    expect(examinationCenter?.code).toBe('TestExaminationCenterCode');
    expect(examinationCenter?.address).toBe('test address');
    expect(examinationCenter?.isActive).toBe(false);
    expect(examinationCenter?.businessUnits[0].id).toBe(
      EditExaminationCenterE2eSeed.businessUnitId,
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
