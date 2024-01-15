import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import supertest from 'supertest';
import { LogoutE2eSeed } from '#test/e2e/sga/admin-user/logout.e2e-seeds';
import { refreshTokenSchema } from '#admin-user/infrastructure/config/schema/refresh-token.schema';
import { Repository } from 'typeorm';
import { RefreshToken } from '#admin-user/domain/entity/refresh-token.entity';

const path = '/auth/logout';

describe('/auth/logout (GET)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let codeRepository: Repository<RefreshToken>;

  beforeAll(async () => {
    app = await startApp();
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
    await app.close();
    await datasource.destroy();
  });
});
