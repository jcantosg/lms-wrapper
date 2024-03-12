import { HttpServer, INestApplication } from '@nestjs/common';
import datasource from '#config/ormconfig';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUserPostgresRepository } from '#admin-user/infrastructure/repository/admin-user.postgres-repository';
import { AddBusinessUnitsToAdminUserE2eSeedDataConfig } from '#test/e2e/sga/admin-user/seed-data-config/add-business-units-to-admin-user.e2e-seed-data-config';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { startApp } from '#test/e2e/e2e-helper';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { RemoveBusinessUnitFromAdminUserE2eSeed } from '#test/e2e/sga/admin-user/remove-business-unit-from-admin-user.e2e-seed';

const path = `/admin-user/${AddBusinessUnitsToAdminUserE2eSeedDataConfig.gestor360User.userId}/remove-business-unit`;

describe('Remove Business Units from Admin User (PUT)', () => {
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
    seeder = new RemoveBusinessUnitFromAdminUserE2eSeed(datasource);
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
      .send({ businessUnit: 'invalid-id' })
      .expect(400);
  });

  it('should return not found 404 (admin user not found in db)', async () => {
    const madridBusinessUnit =
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.businessUnits.find(
        (businessUnit) => businessUnit.code === 'MAD',
      );
    const response = await supertest(httpServer)
      .put(
        `/admin-user/087c5212-9b63-4a3b-9913-0781bd99b271/remove-business-unit`,
      )
      .auth(superAdminUserToken, { type: 'bearer' })
      .send({ businessUnit: madridBusinessUnit?.id })
      .expect(404);

    expect(response.body.message).toBe('sga.admin-user.not-found');
  });

  it('should return not found 404 (business unit not include on the admin user business unit requester)', async () => {
    const madridBusinessUnit =
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.businessUnits.find(
        (businessUnit) => businessUnit.code === 'MAD',
      );
    const response = await supertest(httpServer)
      .put(
        `/admin-user/${AddBusinessUnitsToAdminUserE2eSeedDataConfig.gestor360MurciaUser.userId}/remove-business-unit`,
      )
      .auth(supervisor360UserToken, { type: 'bearer' })
      .send({ businessUnit: madridBusinessUnit?.id })
      .expect(404);

    expect(response.body.message).toBe('sga.admin-user.not-found');
  });

  it('should return forbidden 403 (not roles permitted)', async () => {
    const madridBusinessUnit =
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.businessUnits.find(
        (businessUnit) => businessUnit.code === 'MAD',
      );
    const response = await supertest(httpServer)
      .put(
        `/admin-user/${AddBusinessUnitsToAdminUserE2eSeedDataConfig.secretariaUser.userId}/remove-business-unit`,
      )
      .auth(supervisor360UserToken, { type: 'bearer' })
      .send({ businessUnit: madridBusinessUnit?.id })
      .expect(403);

    expect(response.body.message).toBe('sga.admin-user.not-allowed-roles');
  });

  it('should return a 200 business unit removed', async () => {
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
      .send({ businessUnit: barcelonaBusinessUnit?.id })
      .expect(200);

    const gestor360User = await adminUserRepository.get(
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.gestor360User.userId,
    );

    expect(gestor360User?.businessUnits.length).toEqual(1);
    expect(gestor360User?.businessUnits).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({
          id: barcelonaBusinessUnit?.id,
        }),
      ]),
    );
  });

  afterAll(async () => {
    await app.close();
    await seeder.clear();
    await datasource.destroy();
  });
});
