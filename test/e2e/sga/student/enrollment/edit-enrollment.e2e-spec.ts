import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { EditEnrollmentE2eSeed } from '#test/e2e/sga/student/enrollment/edit-enrollment.e2e-seeds';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { EnrollmentTypeEnum } from '#student/domain/enum/enrollment/enrollment-type.enum';
import { EnrollmentVisibilityEnum } from '#student/domain/enum/enrollment/enrollment-visibility.enum';

const path = `/enrollment/${EditEnrollmentE2eSeed.enrollmentId}`;

describe('/enrollment/:id (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new EditEnrollmentE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        EditEnrollmentE2eSeed.superAdminUserEmail,
        EditEnrollmentE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        EditEnrollmentE2eSeed.adminUserEmail,
        EditEnrollmentE2eSeed.adminUserPassword,
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
  it('should return bad request', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });
  it('should edit an Enrollment', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        type: EnrollmentTypeEnum.VALIDATED,
        visibility: EnrollmentVisibilityEnum.YES,
        maxCalls: 3,
      })
      .expect(200);
  });
  it('should throw an EnrollmentNotFoundException', async () => {
    const response = await supertest(httpServer)
      .put(`/enrollment/${EditEnrollmentE2eSeed.subjectId}`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        type: EnrollmentTypeEnum.VALIDATED,
        visibility: EnrollmentVisibilityEnum.YES,
        maxCalls: 3,
      })
      .expect(404);
    expect(response.body.message).toEqual('sga.enrollment.not-found');
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
