import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { MoveStudentFromAdministrativeGroupE2eSeed } from '#test/e2e/sga/student/administrative-group/move-student-from-administrative-group.e2e-seed';

const path = '/administrative-group/move';

describe('/administrative-group/move (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new MoveStudentFromAdministrativeGroupE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        MoveStudentFromAdministrativeGroupE2eSeed.superAdminUserEmail,
        MoveStudentFromAdministrativeGroupE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        MoveStudentFromAdministrativeGroupE2eSeed.adminUserEmail,
        MoveStudentFromAdministrativeGroupE2eSeed.adminUserPassword,
      ),
    ]);
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });

  it('should return forbidden', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('should return bad request (empty body)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  it('should throw 404 error (administrative group not found)', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        studentIds: [MoveStudentFromAdministrativeGroupE2eSeed.studentId],
        administrativeGroupOriginId: 'f0156fad-828e-432b-bb3d-a92a4ec7fff7',
        administrativeGroupDestinationId:
          MoveStudentFromAdministrativeGroupE2eSeed.destinationGroupId,
      })
      .expect(404);

    expect(response.body.message).toBe('sga.administrative-group.not-found');
  });

  it('should throw 404 error (student not found)', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        studentIds: ['b6080e2a-ca4e-46cb-a918-fb652d8dbf50'],
        administrativeGroupOriginId:
          MoveStudentFromAdministrativeGroupE2eSeed.originGroupId,
        administrativeGroupDestinationId:
          MoveStudentFromAdministrativeGroupE2eSeed.destinationGroupId,
      })
      .expect(404);

    expect(response.body.message).toBe('sga.student.not-found');
  });

  it('should move student to target administrative group', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        studentIds: [MoveStudentFromAdministrativeGroupE2eSeed.studentId],
        administrativeGroupOriginId:
          MoveStudentFromAdministrativeGroupE2eSeed.originGroupId,
        administrativeGroupDestinationId:
          MoveStudentFromAdministrativeGroupE2eSeed.destinationGroupId,
      })
      .expect(200);
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
