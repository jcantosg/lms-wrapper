import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { RecoveryPasswordTokenPostgresRepository } from '#admin-user/infrastructure/repository/recovery-password-token.postgres-repository';
import { GenerateRecoveryPasswordTokenE2eSeed } from '#test/e2e/sga/admin-user/generate-recovery-password-token.e2e-seed';
import { recoveryPasswordTokenSchema } from '#admin-user/infrastructure/config/schema/recovery-password-token.schema';

const path = '/recover-password';

describe('/recover-password (POST)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GenerateRecoveryPasswordTokenE2eSeed(datasource);
    await seeder.arrange();
  });

  it('should throw user not found exception', async () => {
    await supertest(httpServer)
      .post(path)
      .send({
        email: 'email@notfound.com',
      })
      .expect(404);
  });

  it('should create token', async () => {
    const tokenRepository = new RecoveryPasswordTokenPostgresRepository(
      datasource.getRepository(recoveryPasswordTokenSchema),
    );

    await supertest(httpServer)
      .post(path)
      .send({
        email: GenerateRecoveryPasswordTokenE2eSeed.userEmail,
      })
      .expect(201);

    const token = await tokenRepository.getByUser(
      GenerateRecoveryPasswordTokenE2eSeed.userId,
    );
    expect(token).not.toBeNull();
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
