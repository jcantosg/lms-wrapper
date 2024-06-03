import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { EditProgramBlockE2eSeed } from '#test/e2e/sga/academic-offering/program-block/edit-program-block.e2e-seeds';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';

const path = `/program-block/${EditProgramBlockE2eSeed.programBlockId}`;

describe('Edit Program Block (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new EditProgramBlockE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        EditProgramBlockE2eSeed.superAdminUserEmail,
        EditProgramBlockE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        EditProgramBlockE2eSeed.adminUserEmail,
        EditProgramBlockE2eSeed.adminUserPassword,
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
  it('should return not found', async () => {
    const response = await supertest(httpServer)
      .put('/program-block/3b04f93d-f42f-4ce7-b925-59f478e2f154')
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({ name: 'prueba' })
      .expect(404);

    expect(response.body.message).toEqual('sga.program-block.not-found');
  });
  it('should edit a program block', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({ name: 'prueba' })
      .expect(200);
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
