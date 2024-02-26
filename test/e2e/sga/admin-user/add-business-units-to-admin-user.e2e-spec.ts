import { HttpServer, INestApplication } from '@nestjs/common';
import datasource from '#config/ormconfig';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUserPostgresRepository } from '#admin-user/infrastructure/repository/admin-user.postgres-repository';
import { AddBusinessUnitsToAdminUserE2eSeed } from '#test/e2e/sga/admin-user/add-business-units-to-admin-user.e2e-seed';
import { AddBusinessUnitsToAdminUserE2eSeedDataConfig } from '#test/e2e/sga/admin-user/seed-data-config/add-business-units-to-admin-user.e2e-seed-data-config';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { startApp } from '#test/e2e/e2e-helper';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

const path = `/admin-user/${AddBusinessUnitsToAdminUserE2eSeedDataConfig.gestor360User.userId}/add-business-unit`;

describe('Add Business Units to Admin User (PUT)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminUserToken: string;
  let supervisor360UserToken: string;
  let gestor360UserToken: string;
  let adminUserRepository: AdminUserPostgresRepository;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new AddBusinessUnitsToAdminUserE2eSeed(datasource);
    await seeder.arrange();
    superAdminUserToken = await login(
      httpServer,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.superAdmin.email,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.superAdmin.password,
    );
    supervisor360UserToken = await login(
      httpServer,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.supervisor360User.email,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.supervisor360User.password,
    );
    gestor360UserToken = await login(
      httpServer,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.gestor360User.email,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.gestor360User.password,
    );
  });

  it('Should return Unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });

  it('Should return forbidden (User not Superadmin or Supervisor)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(gestor360UserToken, { type: 'bearer' })
      .expect(403);
  });

  it('should return bad request 400 with empty body', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminUserToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  it('should return bad request 400 with invalid business unit id', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminUserToken, { type: 'bearer' })
      .send({ businessUnits: ['invalid-id'] })
      .expect(400);
  });

  it('should return not found 404 (admin user not found in db)', async () => {
    const murciaBusinessUnit =
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.businessUnits.find(
        (businessUnit) => businessUnit.name === 'Murcia',
      );
    const response = await supertest(httpServer)
      .put(`/admin-user/087c5212-9b63-4a3b-9913-0781bd99b271/add-business-unit`)
      .auth(superAdminUserToken, { type: 'bearer' })
      .send({ businessUnits: [murciaBusinessUnit?.id] })
      .expect(404);

    expect(response.body.message).toBe('sga.admin-user.not-found');
  });

  it('should return not found 404 (business unit not include on the requester)', async () => {
    const murciaBusinessUnit =
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.businessUnits.find(
        (businessUnit) => businessUnit.name === 'Murcia',
      );
    const response = await supertest(httpServer)
      .put(
        `/admin-user/${AddBusinessUnitsToAdminUserE2eSeedDataConfig.gestor360MurciaUser.userId}/add-business-unit`,
      )
      .auth(supervisor360UserToken, { type: 'bearer' })
      .send({ businessUnits: [murciaBusinessUnit?.id] })
      .expect(404);

    expect(response.body.message).toBe('sga.admin-user.not-found');
  });

  it('should return forbidden 403 (not roles permitted)', async () => {
    const murciaBusinessUnit =
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.businessUnits.find(
        (businessUnit) => businessUnit.name === 'Murcia',
      );
    const response = await supertest(httpServer)
      .put(
        `/admin-user/${AddBusinessUnitsToAdminUserE2eSeedDataConfig.secretariaUser.userId}/add-business-unit`,
      )
      .auth(supervisor360UserToken, { type: 'bearer' })
      .send({ businessUnits: [murciaBusinessUnit?.id] })
      .expect(403);

    expect(response.body.message).toBe('sga.admin-user.not-allowed-roles');
  });

  it('should return a 404 business unit not found(bu to add no in the bd)', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(supervisor360UserToken, { type: 'bearer' })
      .send({ businessUnits: ['d31aa8ac-2ef7-4574-8774-d3e95963aaba'] })
      .expect(404);

    expect(response.body.message).toBe(
      'sga.business-unit.business-unit-not-found',
    );
  });

  it('should return a 404 business unit not found(bu to add not allow to requester)', async () => {
    const murciaBusinessUnit =
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.businessUnits.find(
        (businessUnit) => businessUnit.code === 'MUR',
      );
    const response = await supertest(httpServer)
      .put(path)
      .auth(supervisor360UserToken, { type: 'bearer' })
      .send({ businessUnits: [murciaBusinessUnit?.id] })
      .expect(404);

    expect(response.body.message).toBe(
      'sga.business-unit.business-unit-not-found',
    );
  });

  it('should return a 200 business unit added', async () => {
    adminUserRepository = new AdminUserPostgresRepository(
      datasource.getRepository(AdminUser),
    );
    const barcelonaBusinessUnit =
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.businessUnits.find(
        (businessUnit) => businessUnit.code === 'BAR',
      );
    await supertest(httpServer)
      .put(path)
      .auth(supervisor360UserToken, { type: 'bearer' })
      .send({ businessUnits: [barcelonaBusinessUnit?.id] })
      .expect(200);

    const gestor360User = await adminUserRepository.get(
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.gestor360User.userId,
    );

    expect(gestor360User?.businessUnits.length).toEqual(2);
    expect(gestor360User?.businessUnits).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: barcelonaBusinessUnit?.id,
        }),
      ]),
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await app.close();
  });
});
