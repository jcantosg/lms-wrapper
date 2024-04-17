import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import supertest from 'supertest';
import { UpdatePasswordE2eSeed } from '#test/e2e/sga/admin-user/update-password.e2e-seed';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserPostgresRepository } from '#admin-user/infrastructure/repository/admin-user.postgres-repository';
import { RecoveryPasswordTokenPostgresRepository } from '#admin-user/infrastructure/repository/recovery-password-token.postgres-repository';
import { RecoveryPasswordToken } from '#admin-user/domain/entity/recovery-password-token.entity';

const path = '/update-password';

describe('/update-password (PUT)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new UpdatePasswordE2eSeed(datasource);
    await seeder.arrange();
  });

  it('should throw user not found exception', async () => {
    await supertest(httpServer)
      .put(path)
      .send({
        newPassword: 'test123',
        token: '123',
      })
      .expect(404);
  });

  it('should update password', async () => {
    const tokenRepository = new RecoveryPasswordTokenPostgresRepository(
      datasource.getRepository(RecoveryPasswordToken),
    );
    const adminUserRepository = new AdminUserPostgresRepository(
      datasource.getRepository(AdminUser),
    );

    await supertest(httpServer)
      .post('/recover-password')
      .send({
        email: UpdatePasswordE2eSeed.userEmail,
      })
      .expect(201);

    const token = await tokenRepository.getByUser(UpdatePasswordE2eSeed.userId);

    await supertest(httpServer)
      .put(path)
      .send({
        newPassword: 'newPassword123',
        token: token?.token,
      })
      .expect(200);

    const adminUser = await adminUserRepository.get(
      UpdatePasswordE2eSeed.userId,
    );

    expect(adminUser?.password).not.toBe(UpdatePasswordE2eSeed.userPassword);
  });

  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
