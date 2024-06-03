import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { GetAllAdministrativeGroupsE2eSeed } from '#test/e2e/sga/student/administrative-group/get-all-administrative-groups.e2e-seed';

const path = '/administrative-group';

describe('/administrative-group (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetAllAdministrativeGroupsE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetAllAdministrativeGroupsE2eSeed.superAdminUserEmail,
      GetAllAdministrativeGroupsE2eSeed.superAdminUserPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return items (administrativeGroups)', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 2,
    });

    const expectedItems = [
      expect.objectContaining({
        code: 'M-23-25_MAD-INAS_1',
        startMonth: 8,
        academicYear: '2023-2024',
      }),
      expect.objectContaining({
        code: 'M-23-25_MAD-INAS_2',
        startMonth: 9,
        academicYear: '2024-2025',
      }),
    ];

    expect(response.body.items).toEqual(expect.arrayContaining(expectedItems));
  });

  it('should return empty items (administrativeGroups) with query params', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .query({
        startMonth: 1,
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

  it('should return empty items (administrativeGroups) with page 2 and limit default', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .query({
        page: 2,
      })
      .auth(superAdminAccessToken, { type: 'bearer' });

    expect(response.body.pagination).toEqual({
      page: 2,
      limit: 10,
      total: 2,
    });

    expect(response.body.items).toEqual([]);
  });

  it('should return items with query param  startMonth and academicYear', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .query({
        startMonth: 8,
        academicYear: '2023-2024',
      })
      .auth(superAdminAccessToken, { type: 'bearer' });

    expect(response.body.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 1,
    });

    const expectedItems = [
      expect.objectContaining({
        code: 'M-23-25_MAD-INAS_1',
        startMonth: 8,
        academicYear: '2023-2024',
      }),
    ];

    expect(response.body.items).toEqual(expect.arrayContaining(expectedItems));
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
