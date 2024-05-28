import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import { GenerateStudentRecoveryPasswordTokenSeed } from '#test/e2e/student/auth/generate-student-recovery-password-token.e2e-seeds';
import datasource from '#config/ormconfig';
import supertest from 'supertest';

const path = '/student/recover-password';

describe('/student/recover-password', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GenerateStudentRecoveryPasswordTokenSeed(datasource);
    await seeder.arrange();
  });
  it('should throw a 400 error (empty body)', async () => {
    await supertest(httpServer).post(path).send({}).expect(400);
  });
  it('should generate a recovery password token', async () => {
    await supertest(httpServer)
      .post(path)
      .send({
        universaeEmail:
          GenerateStudentRecoveryPasswordTokenSeed.studentUniversaeEmail,
      })
      .expect(201);
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
