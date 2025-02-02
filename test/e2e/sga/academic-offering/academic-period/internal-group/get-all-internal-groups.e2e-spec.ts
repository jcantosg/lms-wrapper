import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { GetAllInternalGroupsE2eSeed } from '#test/e2e/sga/academic-offering/academic-period/internal-group/get-all-internal-groups.e2e-seed';

const path = `/academic-period/${GetAllInternalGroupsE2eSeed.academicPeriodId}/internal-group`;

describe('/academic-period/{id}/internal-group (GET)', () => {
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

  it('should return items (InternalGroups)', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
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

  it('should return empty items (InternalGroups) with query params', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .query({
        subject: 'tomate',
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 0,
    });

    expect(response.body.items).toEqual([]);
  });

  it('should return empty items (InternalGroups) with page 2 and limit default', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .query({
        page: 2,
      })
      .auth(superAdminAccessToken, { type: 'bearer' });

    expect(response.body.pagination).toEqual({
      page: 2,
      limit: 10,
      total: 1,
    });

    expect(response.body.items).toEqual([]);
  });

  it('should return items with query param  subject', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .query({
        subject: GetAllInternalGroupsE2eSeed.subjectId,
      })
      .auth(superAdminAccessToken, { type: 'bearer' });

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

  afterAll(async () => {
    await seeder.clear();
  });
});
