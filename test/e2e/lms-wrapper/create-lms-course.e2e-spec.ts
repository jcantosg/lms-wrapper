import { HttpServer } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { CreateLmsCourseE2eSeed } from '#test/e2e/lms-wrapper/create-lms-course.e2e-seeds';

const path = `/wrapper/lms-course`;

describe('/wrapper/lms-course (POST)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new CreateLmsCourseE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      CreateLmsCourseE2eSeed.superAdminUserEmail,
      CreateLmsCourseE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      CreateLmsCourseE2eSeed.adminUserEmail,
      CreateLmsCourseE2eSeed.adminUserPassword,
    );
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).post(path).expect(401);
  });
  it('should return forbidden', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });
  it('should return bad request', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });
  it('should create a lmsCourse', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        name: 'Test Course',
        shortName: Math.random().toString(10),
        categoryId: 1,
      })
      .expect(201);
  });
});
