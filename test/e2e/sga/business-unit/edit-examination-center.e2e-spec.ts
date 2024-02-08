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
const wrongPath = '/examination-center/6fe5450c-4830-41cb-9e86-1c0ef1bdd5e5';

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
      .put(wrongPath)
      .send({
        name: 'TestBusinessUnit',
        code: 'TestBusinessCode',
        address: 'test address',
        isActive: false,
        countryId: EditExaminationCenterE2eSeed.countryId,
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
  it('should edit the examination center', async () => {
    examinationCenterRepository = new ExaminationCenterPostgresRepository(
      datasource.getRepository(examinationCenterSchema),
    );
    await supertest(httpServer)
      .put(path)
      .send({
        name: 'TestExaminationCenterUnit',
        code: 'TestExaminationCenterCode',
        address: 'test address',
        isActive: false,
        countryId: EditExaminationCenterE2eSeed.countryId,
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
  });

  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
