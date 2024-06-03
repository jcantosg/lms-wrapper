import supertest from 'supertest';
import { HttpServer } from '@nestjs/common';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';
import { EdaeUserPostgresRepository } from '#edae-user/infrastructure/repository/edae-user.postgres-repository';
import { AddBusinessUnitsToEdaeUserE2eSeeds } from '#test/e2e/sga/edae-user/add-business-units-to-edae-user.e2e-seed';
import { edaeUserSchema } from '#edae-user/infrastructure/config/schema/edae-user.schema';

const path =
  '/edae-user/02096887-c100-4170-b470-1230b90bcbc4/add-business-unit';

describe('/edae-user/{id}/add-business-unit', () => {
  let httpServer: HttpServer;
  let seeder: AddBusinessUnitsToEdaeUserE2eSeeds;
  let adminAccessToken: string;
  let superAdminAccessToken: string;
  let edaeUserRepository: EdaeUserRepository;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new AddBusinessUnitsToEdaeUserE2eSeeds(datasource);
    await seeder.arrange();

    [adminAccessToken, superAdminAccessToken] = await Promise.all([
      login(
        httpServer,
        AddBusinessUnitsToEdaeUserE2eSeeds.adminUserEmail,
        AddBusinessUnitsToEdaeUserE2eSeeds.adminUserPassword,
      ),
      login(
        httpServer,
        AddBusinessUnitsToEdaeUserE2eSeeds.superAdminUserEmail,
        AddBusinessUnitsToEdaeUserE2eSeeds.superAdminUserPassword,
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

  it('Should throw a EdaeUserNotFoundException ', async () => {
    await supertest(httpServer)
      .put('/edae-user/68d03278-df64-4afa-a482-89336197243e/add-business-unit')
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        businessUnits: [AddBusinessUnitsToEdaeUserE2eSeeds.businessUnitId],
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

  it('Should throw a BusinessUnitNotFoundException (edaeUser.businessUnits not in adminUser.businessUnits)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        businessUnits: ['ab03f530-fab4-4b06-bf48-d2d3497df4ef'],
      })
      .expect(404);
  });

  it('Should throw a BusinessUnitNotFoundException (request businessUnits not in adminUser.businessUnits)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        businessUnits: [
          AddBusinessUnitsToEdaeUserE2eSeeds.anotherBusinessUnitId,
        ],
      })
      .expect(404);
  });

  it('Should return bad request when empty body', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });

  it('should add business unit to edae user', async () => {
    await seeder.addBusinessUnitToSuperAdminUser();

    edaeUserRepository = new EdaeUserPostgresRepository(
      datasource.getRepository(edaeUserSchema),
    );

    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        businessUnits: [AddBusinessUnitsToEdaeUserE2eSeeds.businessUnitId],
      })
      .expect(200);

    const edaeUser = await edaeUserRepository.get(
      '02096887-c100-4170-b470-1230b90bcbc4',
    );

    expect(edaeUser?.businessUnits).toHaveLength(2);
    expect(edaeUser?.businessUnits).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: AddBusinessUnitsToEdaeUserE2eSeeds.businessUnitId,
          name: AddBusinessUnitsToEdaeUserE2eSeeds.businessUnitName,
          code: AddBusinessUnitsToEdaeUserE2eSeeds.businessUnitCode,
        }),
      ]),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
