import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import supertest from 'supertest';
import {
  DEFAULT_LIMIT,
  FIRST_PAGE,
} from '#/sga/shared/application/collection.query';
import { GetAllAdminUsersE2eSeed } from '#test/e2e/sga/admin-user/get-all-admin-users.e2e-seeds';
import { GetAllAdminUsersE2eSeedDataConfig } from '#test/e2e/sga/admin-user/get-all-admin-users.e2e-seed-data-config';

const path = '/admin-users/search';

describe('/admin-users/search', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetAllAdminUsersE2eSeed(datasource);
    await seeder.arrange();
    adminAccessToken = await login(
      httpServer,
      GetAllAdminUsersE2eSeedDataConfig.adminUsers[1].email,
      GetAllAdminUsersE2eSeedDataConfig.adminUsers[1].password,
    );

    superAdminAccessToken = await login(
      httpServer,
      GetAllAdminUsersE2eSeedDataConfig.adminUsers[0].email,
      GetAllAdminUsersE2eSeedDataConfig.adminUsers[0].password,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return forbidden', async () => {
    await supertest(httpServer)
      .get(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('should return 400 when query field is empty', async () => {
    await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });

  it('should return admin users with query param text', async () => {
    const text = 'romario';
    const response = await supertest(httpServer)
      .get(path)
      .query({
        text,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const adminUsersFilter =
      GetAllAdminUsersE2eSeedDataConfig.adminUsers.filter((adminUser) =>
        adminUser.name.toLowerCase().includes(text),
      );

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: adminUsersFilter.length,
    });

    const adminUsersExpected = adminUsersFilter.map((adminUser) =>
      expect.objectContaining({
        id: adminUser.id,
        name: adminUser.name,
      }),
    );

    expect(response.body.items).toEqual(
      expect.arrayContaining(adminUsersExpected),
    );
  });

  it('should return order by name asc', async () => {
    const text = 'romario';
    const response = await supertest(httpServer)
      .get(path)
      .query({
        orderBy: 'name',
        orderType: 'ASC',
        text,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const adminUsersExpected = GetAllAdminUsersE2eSeedDataConfig.adminUsers
      .filter((adminUser) => adminUser.name.toLowerCase().includes(text))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((adminUser) =>
        expect.objectContaining({
          id: adminUser.id,
          name: adminUser.name,
        }),
      );

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: adminUsersExpected.length,
    });

    expect(response.body.items).toEqual(
      expect.arrayContaining(adminUsersExpected),
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
