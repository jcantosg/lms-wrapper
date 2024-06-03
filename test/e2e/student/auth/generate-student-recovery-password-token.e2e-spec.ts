import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { GenerateStudentRecoveryPasswordTokenSeed } from '#test/e2e/student/auth/generate-student-recovery-password-token.e2e-seeds';

const path = '/student/recover-password';

describe('/student/recover-password', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;

  beforeAll(async () => {
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
  });
});
