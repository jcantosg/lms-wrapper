import { HttpServer } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { GetLmsCoursesE2eSeed } from '#test/e2e/lms-wrapper/get-lms-courses.e2e-seeds';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';

const path = `/wrapper/lms-course`;

describe('/wrapper/lms-course (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetLmsCoursesE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetLmsCoursesE2eSeed.superAdminUserEmail,
      GetLmsCoursesE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      GetLmsCoursesE2eSeed.adminUserEmail,
      GetLmsCoursesE2eSeed.adminUserPassword,
    );
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });
  it('should return forbidden', async () => {
    await supertest(httpServer)
      .get(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });
  it('should return lmsCourses', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 4,
          name: 'Prueba de curso',
        }),
      ]),
    );
  });
});
