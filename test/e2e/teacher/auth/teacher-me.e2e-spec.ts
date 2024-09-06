import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { loginEdaeUser } from '#test/e2e/teacher/e2e-auth-helper';
import { EdaeUserLogoutE2eSeed } from '#test/e2e/teacher/auth/edae-user-logout.e2e-seeds';
import { TeacherMeE2eSeed } from '#test/e2e/teacher/auth/teacher-me.e2e-seed';

const path = '/edae-360/me';

describe('/edae-360/me (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new TeacherMeE2eSeed(datasource);
    await seeder.arrange();
    adminAccessToken = await loginEdaeUser(
      httpServer,
      EdaeUserLogoutE2eSeed.edaeEmail,
      EdaeUserLogoutE2eSeed.edaePassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return all teacher info', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: TeacherMeE2eSeed.edaeId,
        name: TeacherMeE2eSeed.edaeName,
      }),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
