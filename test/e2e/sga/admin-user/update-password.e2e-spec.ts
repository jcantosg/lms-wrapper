import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { UpdatePasswordE2eSeed } from '#test/e2e/sga/admin-user/update-password.e2e-seed';
import { AdminUserStatus } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserPostgresRepository } from '#admin-user/infrastructure/repository/admin-user.postgres-repository';
import { RecoveryPasswordTokenPostgresRepository } from '#admin-user/infrastructure/repository/recovery-password-token.postgres-repository';
import { recoveryPasswordTokenSchema } from '#admin-user/infrastructure/config/schema/recovery-password-token.schema';
import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';

const path = '/update-password';

describe('/update-password (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;

  beforeAll(async () => {
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
      datasource.getRepository(recoveryPasswordTokenSchema),
    );
    const adminUserRepository = new AdminUserPostgresRepository(
      datasource.getRepository(adminUserSchema),
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
    expect(adminUser?.loginAttempts).toBe(0);
    expect(adminUser?.status).toEqual(AdminUserStatus.ACTIVE);
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
