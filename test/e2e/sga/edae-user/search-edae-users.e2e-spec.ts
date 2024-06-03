import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { SearchEdaeUsersE2eSeed } from '#test/e2e/sga/edae-user/search-edae-users.e2e-seeds';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import {
  DEFAULT_LIMIT,
  FIRST_PAGE,
} from '#/sga/shared/application/collection.query';

const path = '/edae-user/search?text=edae';

describe('/edae-user/search (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new SearchEdaeUsersE2eSeed(datasource);
    await seeder.arrange();
    [adminAccessToken, superAdminAccessToken] = await Promise.all([
      login(
        httpServer,
        SearchEdaeUsersE2eSeed.adminUserEmail,
        SearchEdaeUsersE2eSeed.adminUserPassword,
      ),
      login(
        httpServer,
        SearchEdaeUsersE2eSeed.superAdminUserEmail,
        SearchEdaeUsersE2eSeed.superAdminUserPassword,
      ),
    ]);
  });

  it('should throw an forbidden error', async () => {
    await supertest(httpServer)
      .get(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });
  it('should search edae-users', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);
    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: 2,
    });
  });
  afterAll(async () => {
    await seeder.clear();
  });
});
