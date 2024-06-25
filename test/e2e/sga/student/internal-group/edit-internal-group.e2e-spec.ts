import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { GetInternalGroupDetailE2eSeed } from '#test/e2e/sga/student/internal-group/get-internal-group-detail.e2e-seed';
import { v4 as uuid } from 'uuid';
import { internalGroupSchema } from '#student/infrastructure/config/schema/internal-group.schema';

const path = '/internal-group';

describe('/internal-group/:id (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  const internalGroupId = GetInternalGroupDetailE2eSeed.internalGroupId;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetInternalGroupDetailE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        GetInternalGroupDetailE2eSeed.superAdminUserEmail,
        GetInternalGroupDetailE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        GetInternalGroupDetailE2eSeed.adminUserEmail,
        GetInternalGroupDetailE2eSeed.adminUserPassword,
      ),
    ]);
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).put(`${path}/${internalGroupId}`).expect(401);
  });

  it('should return 404 internal group not found', async () => {
    const response = await supertest(httpServer)
      .put(`${path}/${uuid()}`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        code: 'IG002',
        isDefault: true,
      })
      .expect(404);

    expect(response.body.message).toEqual('sga.internal-group.not-found');
  });

  it('should return forbidden for non-superadmin user', async () => {
    const response = await supertest(httpServer)
      .put(`${path}/${internalGroupId}`)
      .auth(adminAccessToken, { type: 'bearer' })
      .send({
        code: 'IG002',
        isDefault: true,
      })
      .expect(403);

    expect(response.body.message).toEqual('Forbidden resource');
  });

  it('should edit an internal group successfully', async () => {
    await supertest(httpServer)
      .put(`${path}/${internalGroupId}`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        code: 'IG002',
        isDefault: true,
      })
      .expect(200);

    const repository = datasource.getRepository(internalGroupSchema);
    const internalGroup = await repository.findOne({
      where: { id: internalGroupId },
    });

    expect(internalGroup?.code).toBe('IG002');
    expect(internalGroup?.isDefault).toBe(true);
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
