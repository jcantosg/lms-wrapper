import { HttpServer, INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import datasource from '#config/ormconfig';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { RemoveEdaeUserFromAdministrativeGroupE2eSeed } from '#test/e2e/sga/student/administrative-group/remove-edae-user-from-administrative-group.e2e-seed';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { AddEdaeUserToAdministrativeGroupE2ESeed } from '#test/e2e/sga/student/administrative-group/add-edae-user-to-administrative-group.e2e-seed';
import { AdministrativeGroupPostgresRepository } from '#student/infrastructure/repository/administrative-group.postgres-repository';
import { administrativeGroupSchema } from '#student/infrastructure/config/schema/administrative-group.schema';

const path = `/administrative-group/${RemoveEdaeUserFromAdministrativeGroupE2eSeed.administrativeGroupId}/remove-edae-user`;

describe('/administrative-group/:id/remove-edae-user (PUT)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  let administrativeGroupRepository: AdministrativeGroupRepository;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new RemoveEdaeUserFromAdministrativeGroupE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      AddEdaeUserToAdministrativeGroupE2ESeed.superAdminUserEmail,
      AddEdaeUserToAdministrativeGroupE2ESeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      AddEdaeUserToAdministrativeGroupE2ESeed.adminUserEmail,
      AddEdaeUserToAdministrativeGroupE2ESeed.adminUserPassword,
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

  it('should return bad request (empty body)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  it('should throw 404 error (administrative group not found)', async () => {
    const response = await supertest(httpServer)
      .put(
        `/administrative-group/373e8d90-5431-426e-9d8f-43e0a51e75e0/remove-edae-user`,
      )
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        edaeUserId: RemoveEdaeUserFromAdministrativeGroupE2eSeed.edaeUserId,
      })
      .expect(404);

    expect(response.body.message).toBe('sga.administrative-group.not-found');
  });

  it('should throw 404 error (edae user not found)', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        edaeUserId: '37c191f5-ca28-4a11-9cbd-28f342c47bfe',
      })
      .expect(404);

    expect(response.body.message).toBe('sga.edae-user.not-found');
  });

  it('should remove edae user from administrative group', async () => {
    administrativeGroupRepository = new AdministrativeGroupPostgresRepository(
      datasource.getRepository(administrativeGroupSchema),
    );

    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        edaeUserId: RemoveEdaeUserFromAdministrativeGroupE2eSeed.edaeUserId,
      })
      .expect(200);

    const administrativeGroup =
      await administrativeGroupRepository.getByAdminUser(
        RemoveEdaeUserFromAdministrativeGroupE2eSeed.administrativeGroupId,
        [],
        true,
      );
    expect(administrativeGroup?.teachers).toHaveLength(0);
    expect(administrativeGroup?.teachers).toEqual([]);
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
