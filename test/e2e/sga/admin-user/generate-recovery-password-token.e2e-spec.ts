import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import supertest from 'supertest';
import { RecoveryPasswordTokenPostgresRepository } from '#admin-user/infrastructure/repository/recovery-password-token.postgres-repository';
import { RecoveryPasswordToken } from '#admin-user/domain/entity/recovery-password-token.entity';
import { GenerateRecoveryPasswordTokenE2eSeed } from '#test/e2e/sga/admin-user/generate-recovery-password-token.e2e-seed';

const path = '/recover-password';

describe('/recover-password (POST)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;

  beforeAll(async () => {
    app = await startApp();
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
      datasource.getRepository(RecoveryPasswordToken),
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
    await app.close();
    await datasource.destroy();
  });
});
