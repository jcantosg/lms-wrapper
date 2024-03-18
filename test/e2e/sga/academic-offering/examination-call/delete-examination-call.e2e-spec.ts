import { DeleteExaminationCallE2eSeed } from '#test/e2e/sga/academic-offering/examination-call/delete-examination-call.e2e.seeds';
import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';

const path = `/examination-call/${DeleteExaminationCallE2eSeed.examinationCallId}`;

describe('/examination-call/:id (DELETE)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new DeleteExaminationCallE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      DeleteExaminationCallE2eSeed.superAdminUserEmail,
      DeleteExaminationCallE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      DeleteExaminationCallE2eSeed.adminUserEmail,
      DeleteExaminationCallE2eSeed.adminUserPassword,
    );
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
  it('should delete examination call', async () => {
    await supertest(httpServer)
      .delete(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);
  });
  it('should throw examination call not found', async () => {
    const response = await supertest(httpServer)
      .delete(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);

    expect(response.body.message).toEqual('sga.examination-call.not-found');
  });
  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
