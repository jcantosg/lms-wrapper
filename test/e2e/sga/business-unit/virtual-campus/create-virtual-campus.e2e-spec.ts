import supertest from 'supertest';
import { INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { CreateVirtualCampusE2eSeeds } from '#test/e2e/sga/business-unit/virtual-campus/create-virtual-campus.e2e-seeds';

const path = '/virtual-campus';

describe('/virtual-campus (POST)', () => {
  let app: INestApplication;
  let httpServer: any;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new CreateVirtualCampusE2eSeeds(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      CreateVirtualCampusE2eSeeds.superAdminUserEmail,
      CreateVirtualCampusE2eSeeds.superAdminUserPassword,
    );
  });
  it('Should return unauthorized (User not authenticated)', async () => {
    await supertest(httpServer).post(path).expect(401);
  });

  it('Should throw BusinessUnitNotFoundException', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: 'dc87e917-ea81-40de-b887-e6b3a1db23fd',
        name: 'New virtual campus name',
        code: 'New virtual campus code',
        businessUnitId: '09eccb0f-acd5-4ecb-8b9f-1a71d2485061',
      })
      .expect(404);
  });

  it('Should create a virtual campus', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateVirtualCampusE2eSeeds.newVirtualCampusId,
        name: 'New virtual campus name',
        code: 'New virtual campus code code',
        businessUnitId: CreateVirtualCampusE2eSeeds.businessUnitId,
      })
      .expect(201);
  });
  it('should throw a virtual campus duplicated error (409)', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateVirtualCampusE2eSeeds.virtualCampusId,
        name: CreateVirtualCampusE2eSeeds.virtualCampusName,
        code: CreateVirtualCampusE2eSeeds.virtualCampusCode,
        businessUnitId: CreateVirtualCampusE2eSeeds.businessUnitId,
      })
      .expect(409);
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
