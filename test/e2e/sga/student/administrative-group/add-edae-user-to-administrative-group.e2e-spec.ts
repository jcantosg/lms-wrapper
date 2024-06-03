import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { AddEdaeUserToAdministrativeGroupE2ESeed } from '#test/e2e/sga/student/administrative-group/add-edae-user-to-administrative-group.e2e-seed';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { AdministrativeGroupPostgresRepository } from '#student/infrastructure/repository/administrative-group.postgres-repository';
import { administrativeGroupSchema } from '#student/infrastructure/config/schema/administrative-group.schema';

const path = `/administrative-group/${AddEdaeUserToAdministrativeGroupE2ESeed.administrativeGroupId}/add-edae-user`;

describe('/administrative-group/:id/add-edae-user (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  let administrativeGroupRepository: AdministrativeGroupRepository;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new AddEdaeUserToAdministrativeGroupE2ESeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        AddEdaeUserToAdministrativeGroupE2ESeed.superAdminUserEmail,
        AddEdaeUserToAdministrativeGroupE2ESeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        AddEdaeUserToAdministrativeGroupE2ESeed.adminUserEmail,
        AddEdaeUserToAdministrativeGroupE2ESeed.adminUserPassword,
      ),
    ]);
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
        `/administrative-group/373e8d90-5431-426e-9d8f-43e0a51e75e0/add-edae-user`,
      )
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        edaeUserIds: [AddEdaeUserToAdministrativeGroupE2ESeed.edaeUserId],
      })
      .expect(404);

    expect(response.body.message).toBe('sga.administrative-group.not-found');
  });

  it('should throw 404 error (edae user not found)', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        edaeUserIds: ['37c191f5-ca28-4a11-9cbd-28f342c47bfe'],
      })
      .expect(404);

    expect(response.body.message).toBe('sga.edae-user.not-found');
  });

  it('should add edae user to administrative group', async () => {
    administrativeGroupRepository = new AdministrativeGroupPostgresRepository(
      datasource.getRepository(administrativeGroupSchema),
    );

    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        edaeUserIds: [AddEdaeUserToAdministrativeGroupE2ESeed.edaeUserId],
      })
      .expect(200);

    const administrativeGroup =
      await administrativeGroupRepository.getByAdminUser(
        AddEdaeUserToAdministrativeGroupE2ESeed.administrativeGroupId,
        [],
        true,
      );

    expect(administrativeGroup?.teachers).toHaveLength(1);
    expect(administrativeGroup?.teachers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: AddEdaeUserToAdministrativeGroupE2ESeed.edaeUserId,
        }),
      ]),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
