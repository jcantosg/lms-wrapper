import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { DeleteTitleE2eSeed } from '#test/e2e/sga/academic-offering/title/delete-title.e2e.seeds';

const path = `/title/${DeleteTitleE2eSeed.titleId}`;

describe('/title/:id (DELETE)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new DeleteTitleE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        DeleteTitleE2eSeed.superAdminUserEmail,
        DeleteTitleE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        DeleteTitleE2eSeed.adminUserEmail,
        DeleteTitleE2eSeed.adminUserPassword,
      ),
    ]);
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).delete(path).expect(401);
  });

  it('should return forbidden', async () => {
    await supertest(httpServer)
      .delete(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('should delete title', async () => {
    await supertest(httpServer)
      .delete(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);
  });

  it('should throw title not found', async () => {
    const response = await supertest(httpServer)
      .delete(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);

    expect(response.body.message).toEqual('sga.title.not-found');
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
