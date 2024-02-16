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
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { GetAllAdminUsersE2eSeed } from '#test/e2e/sga/admin-user/get-all-admin-users.e2e-seeds';
import { GetAllAdminUsersE2eSeedDataConfig } from '#test/e2e/sga/admin-user/get-all-admin-users.e2e-seed-data-config';

const path = '/admin-users';

describe('/admin-users', () => {
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

  it('should return admin users with page and limit default', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: GetAllAdminUsersE2eSeedDataConfig.adminUsers.length,
    });

    const expectedItems = GetAllAdminUsersE2eSeedDataConfig.adminUsers.map(
      (adminUser) =>
        expect.objectContaining({
          id: adminUser.id,
          name: adminUser.name,
        }),
    );
    expect(response.body.items).toEqual(expect.arrayContaining(expectedItems));
  });

  it('should return admin users empty with page 2 and limit default', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .query({
        page: 2,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: 2,
      limit: DEFAULT_LIMIT,
      total: GetAllAdminUsersE2eSeedDataConfig.adminUsers.length,
    });

    expect(response.body.items).toEqual([]);
  });

  it('should return 400 when query field doest not exist', async () => {
    await supertest(httpServer)
      .get(path)
      .query({
        name2: 'test',
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });

  it('should return admin users with query param name', async () => {
    const name = 'romario';
    const response = await supertest(httpServer)
      .get(path)
      .query({
        name,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const adminUsersFilter =
      GetAllAdminUsersE2eSeedDataConfig.adminUsers.filter((adminUser) =>
        adminUser.name.toLowerCase().includes(name),
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

  it('should return admin users with query param name and query param surname', async () => {
    const name = 'romario';
    const surname = 'oliveira';

    const response = await supertest(httpServer)
      .get(path)
      .query({
        name,
        surname,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const adminUsersFilter =
      GetAllAdminUsersE2eSeedDataConfig.adminUsers.filter(
        (adminUser) =>
          adminUser.name.toLowerCase().includes(name) &&
          adminUser.surname.toLowerCase().includes(surname),
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

  it('should return admin users with query param businessUnit', async () => {
    const businessUnit = 'Sevilla';
    const response = await supertest(httpServer)
      .get(path)
      .query({
        businessUnit,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: 1,
    });

    const adminUsersExpected = expect.objectContaining({
      id: GetAllAdminUsersE2eSeedDataConfig.adminUsers[0].id,
      name: GetAllAdminUsersE2eSeedDataConfig.adminUsers[0].name,
    });

    expect(response.body.items).toEqual(
      expect.arrayContaining([adminUsersExpected]),
    );
  });

  it('should return admin users with query param role', async () => {
    const role = AdminUserRoles.GESTOR_360;
    const response = await supertest(httpServer)
      .get(path)
      .query({
        role,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const adminUsersFilter =
      GetAllAdminUsersE2eSeedDataConfig.adminUsers.filter((adminUser) =>
        adminUser.roles.find((adminUserRole) => adminUserRole === role),
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
    const response = await supertest(httpServer)
      .get(path)
      .query({
        orderBy: 'name',
        orderType: 'ASC',
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const adminUsersExpected = GetAllAdminUsersE2eSeedDataConfig.adminUsers
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
