import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { GetAllEdaeUsersE2eSeed } from '#test/e2e/sga/edae-user/get-all-edae-users.e2e-seeds';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import {
  DEFAULT_LIMIT,
  FIRST_PAGE,
} from '#/sga/shared/application/collection.query';

const path = '/edae-user';

describe('/edae-user (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetAllEdaeUsersE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetAllEdaeUsersE2eSeed.superAdminUserEmail,
      GetAllEdaeUsersE2eSeed.superAdminUserPassword,
    );
  });
  it('should throw an unauthorized error', async () => {
    await supertest(httpServer).get(path).expect(401);
  });
  it('should return an edae users list', async () => {
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
  it('should return an edae users list (with params)', async () => {
    const pathQuery = `${path}?email=${GetAllEdaeUsersE2eSeed.secondEdaeuUserEmail}
      &name=${GetAllEdaeUsersE2eSeed.secondEdaeUserName}`;
    const response = await supertest(httpServer)
      .get(pathQuery)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);
    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: 1,
    });
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
