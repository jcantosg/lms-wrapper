import { Repository } from 'typeorm';
import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { LogoutE2eSeed } from '#test/e2e/sga/admin-user/logout.e2e-seeds';
import { EdaeUserRefreshToken } from '#/teacher/domain/entity/edae-user-refresh-token.entity';
import { loginEdaeUser } from '#test/e2e/teacher/e2e-auth-helper';
import { edaeUserRefreshTokenSchema } from '#/teacher/infrastructure/config/schema/edae-user-refresh-token.schema';
import { EdaeUserLogoutE2eSeed } from '#test/e2e/teacher/auth/edae-user-logout.e2e-seeds';

const path = '/edae-360/logout';

describe('/auth/logout (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let codeRepository: Repository<EdaeUserRefreshToken>;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new EdaeUserLogoutE2eSeed(datasource);
    await seeder.arrange();
    adminAccessToken = await loginEdaeUser(
      httpServer,
      EdaeUserLogoutE2eSeed.edaeEmail,
      EdaeUserLogoutE2eSeed.edaePassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).post(path).expect(401);
  });

  it('should logout user', async () => {
    codeRepository = datasource.getRepository(edaeUserRefreshTokenSchema);

    await supertest(httpServer)
      .post(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(201);

    const refreshTokens = await codeRepository.find({
      where: { user: { id: LogoutE2eSeed.id } },
    });

    expect(refreshTokens.every((token) => token.isRevoked)).toBeTruthy();
  });
  afterAll(async () => {
    await seeder.clear();
  });
});
