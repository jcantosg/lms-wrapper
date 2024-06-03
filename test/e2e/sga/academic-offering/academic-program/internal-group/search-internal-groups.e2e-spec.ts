import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { GetAllInternalGroupsE2eSeed } from '#test/e2e/sga/academic-offering/academic-program/internal-group/get-all-internal-groups.e2e-seed';

const path =
  '/academic-program/906d5184-3204-4847-b351-6267ce7f97a5/internal-group/search';

describe('/academic-program/906d5184-3204-4847-b351-6267ce7f97a5/internal-group/search (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetAllInternalGroupsE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetAllInternalGroupsE2eSeed.superAdminUserEmail,
      GetAllInternalGroupsE2eSeed.superAdminUserPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return 400 with empty body', async () => {
    await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });

  it('should return items with filter found', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .query({ text: 'code' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 1,
    });

    const expectedItems = [
      expect.objectContaining({
        id: GetAllInternalGroupsE2eSeed.internalGroupId,
        code: GetAllInternalGroupsE2eSeed.internalGroupCode,
      }),
    ];

    expect(response.body.items).toEqual(expect.arrayContaining(expectedItems));
  });

  it('should return empty items with filter not found', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .query({ text: 'tomate' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 0,
    });
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
