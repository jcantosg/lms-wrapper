import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { LogoutE2eSeed } from '#test/e2e/sga/admin-user/logout.e2e-seeds';
import { refreshTokenSchema } from '#admin-user/infrastructure/config/schema/refresh-token.schema';
import { Repository } from 'typeorm';
import { RefreshToken } from '#admin-user/domain/entity/refresh-token.entity';

const path = '/auth/logout';

describe('/auth/logout (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let codeRepository: Repository<RefreshToken>;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new LogoutE2eSeed(datasource);
    await seeder.arrange();
    adminAccessToken = await login(
      httpServer,
      LogoutE2eSeed.email,
      LogoutE2eSeed.password,
    );
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });
  it('should logout user', async () => {
    codeRepository = datasource.getRepository(refreshTokenSchema);

    await supertest(httpServer)
      .get(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(200);

    const refreshTokens = await codeRepository.find({
      where: { user: { id: LogoutE2eSeed.id } },
    });

    expect(refreshTokens.every((token) => token.isRevoked)).toBeTruthy();
  });
  afterAll(async () => {
    await seeder.clear();
  });
});
