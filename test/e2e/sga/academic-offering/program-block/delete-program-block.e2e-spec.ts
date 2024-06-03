import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { DeleteProgramBlockE2eSeed } from '#test/e2e/sga/academic-offering/program-block/delete-program-block.e2e-seed';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';

const path = `/program-block/${DeleteProgramBlockE2eSeed.programBlockId}`;

describe('/program-block/:id (DELETE)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let gestor360AccessToken: string;
  let secretariaAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new DeleteProgramBlockE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, gestor360AccessToken, secretariaAccessToken] =
      await Promise.all([
        login(
          httpServer,
          DeleteProgramBlockE2eSeed.superAdminUserEmail,
          DeleteProgramBlockE2eSeed.superAdminUserPassword,
        ),
        login(
          httpServer,
          DeleteProgramBlockE2eSeed.adminUserGestor360Email,
          DeleteProgramBlockE2eSeed.adminUserGestor360Password,
        ),
        login(
          httpServer,
          DeleteProgramBlockE2eSeed.adminUserSecretariaEmail,
          DeleteProgramBlockE2eSeed.adminUserSecretariaPassword,
        ),
      ]);
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
  });
});
