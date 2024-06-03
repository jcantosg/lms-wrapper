import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { CreateEnrollmentE2eSeed } from '#test/e2e/sga/student/enrollment/create-enrollment.e2e-seeds';
import { login } from '#test/e2e/sga/e2e-auth-helper';

const path = `/enrollment`;
describe('/enrollment (POST)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new CreateEnrollmentE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        CreateEnrollmentE2eSeed.superAdminUserEmail,
        CreateEnrollmentE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        CreateEnrollmentE2eSeed.adminUserPassword,
        CreateEnrollmentE2eSeed.adminUserPassword,
      ),
    ]);
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).post(path).expect(401);
  });
  it('should return forbidden', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(401);
  });
  it('should return bad request', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });
  it('should return create an enrollment', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        ids: [
          {
            enrollmentId: CreateEnrollmentE2eSeed.enrollmentId,
            subjectId: CreateEnrollmentE2eSeed.subjectId,
          },
        ],
        academicRecordId: CreateEnrollmentE2eSeed.academicRecordId,
      })
      .expect(201);
  });
  it('should throw an AcademicRecordNotFoundException', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        ids: [
          {
            enrollmentId: CreateEnrollmentE2eSeed.enrollmentId,
            subjectId: CreateEnrollmentE2eSeed.subjectId,
          },
        ],
        academicRecordId: '30eb5205-f5c1-460e-9627-8be21084a4b2',
      })
      .expect(404);
    expect(response.body.message).toEqual('sga.academic-record.not-found');
  });

  it('should throw an SubjectNotFound', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        ids: [
          {
            enrollmentId: CreateEnrollmentE2eSeed.enrollmentId,
            subjectId: 'ea1f2ab4-1f45-4083-a18d-5681f36224b6',
          },
        ],
        academicRecordId: CreateEnrollmentE2eSeed.academicRecordId,
      })
      .expect(404);
    expect(response.body.message).toEqual('sga.subject.not-found');
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
