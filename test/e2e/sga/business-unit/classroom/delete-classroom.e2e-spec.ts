import { HttpServer } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { DeleteClassroomE2eSeed } from '#test/e2e/sga/business-unit/classroom/delete-classroom.e2e-seeds';

const path = `/classroom/${DeleteClassroomE2eSeed.classroomId}`;

describe('/classroom/:id (DELETE)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new DeleteClassroomE2eSeed(datasource);
    await seeder.arrange();
    [adminAccessToken, superAdminAccessToken] = await Promise.all([
      login(
        httpServer,
        DeleteClassroomE2eSeed.adminUserEmail,
        DeleteClassroomE2eSeed.adminUserPassword,
      ),
      login(
        httpServer,
        DeleteClassroomE2eSeed.superAdminUserEmail,
        DeleteClassroomE2eSeed.superAdminUserPassword,
      ),
    ]);
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).delete(path).expect(401);
  });

  it('should return forbidden', async () => {
    await supertest(httpServer)
      .delete(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('should delete a classroom', async () => {
    await supertest(httpServer)
      .delete(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    await supertest(httpServer)
      .delete(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
