import supertest from 'supertest';
import { DeleteProgramBlockE2eSeed } from '#test/e2e/sga/academic-offering/program-block/delete-program-block.e2e-seed';
import datasource from '#config/ormconfig';
import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import { login } from '#test/e2e/sga/e2e-auth-helper';

const path = `/program-block/${DeleteProgramBlockE2eSeed.programBlockId}`;

describe('/program-block/:id (DELETE)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let gestor360AccessToken: string;
  let secretariaAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new DeleteProgramBlockE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      DeleteProgramBlockE2eSeed.superAdminUserEmail,
      DeleteProgramBlockE2eSeed.superAdminUserPassword,
    );

    gestor360AccessToken = await login(
      httpServer,
      DeleteProgramBlockE2eSeed.adminUserGestor360Email,
      DeleteProgramBlockE2eSeed.adminUserGestor360Password,
    );

    secretariaAccessToken = await login(
      httpServer,
      DeleteProgramBlockE2eSeed.adminUserSecretariaEmail,
      DeleteProgramBlockE2eSeed.adminUserSecretariaPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });

  it('should return forbidden', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(secretariaAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('should return 404 if the program block (bu) not in business unit requester ', async () => {
    const response = await supertest(httpServer)
      .delete(path)
      .auth(gestor360AccessToken, { type: 'bearer' })
      .expect(404);

    expect(response.body.message).toBe('sga.program-block.not-found');
  });

  it('should return 409 if the program block has subjects', async () => {
    const response = await supertest(httpServer)
      .delete(`/program-block/${DeleteProgramBlockE2eSeed.programBlockId2}`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(409);

    expect(response.body.message).toBe('sga.program-block.has-subjects');
  });

  it('should delete program block', async () => {
    await supertest(httpServer)
      .delete(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
