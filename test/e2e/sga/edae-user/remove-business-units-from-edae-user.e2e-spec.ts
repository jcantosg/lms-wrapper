import supertest from 'supertest';
import datasource from '#config/ormconfig';
import { INestApplication } from '@nestjs/common';
import { startApp } from '#test/e2e/e2e-helper';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';
import { EdaeUserPostgresRepository } from '#edae-user/infrastructure/repository/edae-user.postgres-repository';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { RemoveBusinessUnitsFromEdaeUserE2eSeeds } from '#test/e2e/sga/edae-user/remove-business-units-from-edae-user.e2e-seed';

const path =
  '/edae-user/02096887-c100-4170-b470-1230b90bcbc4/remove-business-unit';

describe('/edae-user/{id}/remove-business-unit', () => {
  let app: INestApplication;
  let httpServer: any;
  let seeder: RemoveBusinessUnitsFromEdaeUserE2eSeeds;
  let adminAccessToken: string;
  let superAdminAccessToken: string;
  let edaeUserRepository: EdaeUserRepository;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new RemoveBusinessUnitsFromEdaeUserE2eSeeds(datasource);
    await seeder.arrange();
    adminAccessToken = await login(
      httpServer,
      RemoveBusinessUnitsFromEdaeUserE2eSeeds.adminUserEmail,
      RemoveBusinessUnitsFromEdaeUserE2eSeeds.adminUserPassword,
    );
    superAdminAccessToken = await login(
      httpServer,
      RemoveBusinessUnitsFromEdaeUserE2eSeeds.superAdminUserEmail,
      RemoveBusinessUnitsFromEdaeUserE2eSeeds.superAdminUserPassword,
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

  it('Should throw a EdaeUserNotFoundException ', async () => {
    await supertest(httpServer)
      .put(
        '/edae-user/68d03278-df64-4afa-a482-89336197243e/remove-business-unit',
      )
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        businessUnit: RemoveBusinessUnitsFromEdaeUserE2eSeeds.businessUnitId,
      })
      .expect(404);
  });

  it('Should throw a BusinessUnitNotFoundException ', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        businessUnit: 'ab03f530-fab4-4b06-bf48-d2d3497df4ef',
      })
      .expect(404);
  });

  it('Should throw a BusinessUnitNotFoundException (edaeUser.businessUnits not in adminUser.businessUnits)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        businessUnit: 'ab03f530-fab4-4b06-bf48-d2d3497df4ef',
      })
      .expect(404);
  });

  it('Should throw a BusinessUnitNotFoundException (request businessUnits not in adminUser.businessUnits)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        businessUnit:
          RemoveBusinessUnitsFromEdaeUserE2eSeeds.anotherBusinessUnitId,
      })
      .expect(404);
  });

  it('Should return bad request when empty body', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });

  it('should remove business unit from edae user', async () => {
    await seeder.addBusinessUnitToEdaeUser();

    edaeUserRepository = new EdaeUserPostgresRepository(
      datasource.getRepository(EdaeUser),
    );

    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        businessUnit: RemoveBusinessUnitsFromEdaeUserE2eSeeds.businessUnitId,
      })
      .expect(200);

    const edaeUser = await edaeUserRepository.get(
      '02096887-c100-4170-b470-1230b90bcbc4',
    );

    expect(edaeUser?.businessUnits).toHaveLength(1);
    expect(edaeUser?.businessUnits).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: RemoveBusinessUnitsFromEdaeUserE2eSeeds.businessUnitId,
          name: RemoveBusinessUnitsFromEdaeUserE2eSeeds.businessUnitName,
          code: RemoveBusinessUnitsFromEdaeUserE2eSeeds.businessUnitCode,
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