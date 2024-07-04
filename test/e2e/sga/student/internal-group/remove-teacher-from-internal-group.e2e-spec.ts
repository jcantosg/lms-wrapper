import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { Repository } from 'typeorm';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { AddInternalGroupToAcademicPeriodE2eSeed } from '#test/e2e/sga/student/internal-group/add-internal-group-to-academic-period.e2e-seed';
import { internalGroupSchema } from '#student/infrastructure/config/schema/internal-group.schema';
import { GetAllInternalGroupsE2eSeed } from '#test/e2e/sga/student/internal-group/get-all-internal-groups.e2e-seed';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { edaeUserSchema } from '#edae-user/infrastructure/config/schema/edae-user.schema';

const path = `/internal-group/${GetAllInternalGroupsE2eSeed.internalGroupId}/remove-teacher`;

describe('/internal-group/{id}/remove-teacher (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  let internalGroupRepository: Repository<InternalGroup>;
  let edaeUserRepository: Repository<EdaeUser>;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetAllInternalGroupsE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        AddInternalGroupToAcademicPeriodE2eSeed.superAdminUserEmail,
        AddInternalGroupToAcademicPeriodE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        AddInternalGroupToAcademicPeriodE2eSeed.adminUserEmail,
        AddInternalGroupToAcademicPeriodE2eSeed.adminUserPassword,
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

  it('should return 404 internal group not found', async () => {
    const response = await supertest(httpServer)
      .put(
        '/internal-group/4bc9cbfc-decf-4546-b4ac-483a93b8a33f/remove-teacher',
      )
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        teacherId: '4bc9cbfc-decf-4546-b4ac-483a93b8a33f',
      })
      .expect(404);

    expect(response.body.message).toEqual('sga.internal-group.not-found');
  });

  it('should return 404 edae user not found', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        teacherId: '4bc9cbfc-daaf-4546-b4ac-483222b8a33f',
      })
      .expect(404);

    expect(response.body.message).toEqual('sga.edae-user.not-found');
  });

  it('should return 404 edae user not found (different business unit)', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        teacherId: GetAllInternalGroupsE2eSeed.anotherEdaeUserId,
      })
      .expect(404);

    expect(response.body.message).toEqual('sga.edae-user.not-found');
  });

  it('should return 409 cant remove default teacher', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        teacherId: GetAllInternalGroupsE2eSeed.defaultEdaeUserId,
      })
      .expect(409);

    expect(response.body.message).toEqual(
      'sga.internal-group.cant-remove-default-teacher',
    );
  });

  it('should remove a teacher from the internal group', async () => {
    internalGroupRepository = datasource.getRepository(internalGroupSchema);
    edaeUserRepository = datasource.getRepository(edaeUserSchema);

    const edaeUser = await edaeUserRepository.findOne({
      where: { id: GetAllInternalGroupsE2eSeed.alreadyAddedEdaeUserId },
    });

    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        teacherId: GetAllInternalGroupsE2eSeed.alreadyAddedEdaeUserId,
      })
      .expect(200);

    const internalGroup = await internalGroupRepository.findOne({
      where: {
        id: GetAllInternalGroupsE2eSeed.internalGroupId,
      },
      relations: { teachers: true },
    });

    expect(internalGroup!.teachers.map((teacher) => teacher.id)).not.toContain(
      edaeUser!.id,
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
