import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { GetInternalGroupDetailE2eSeed } from '#test/e2e/sga/student/internal-group/get-internal-group-detail.e2e-seed';

const path = `/internal-group/${GetInternalGroupDetailE2eSeed.internalGroupId}/students`;

describe('/internal-group/{id}/students (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetInternalGroupDetailE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetInternalGroupDetailE2eSeed.superAdminUserEmail,
      GetInternalGroupDetailE2eSeed.superAdminUserPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return items with filter found', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .query({ text: GetInternalGroupDetailE2eSeed.studentName })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 1,
    });

    const expectedItems = [
      expect.objectContaining({
        id: GetInternalGroupDetailE2eSeed.studentId,
        documentNumber: GetInternalGroupDetailE2eSeed.studentDocumentNumber,
        enrollmentId: GetInternalGroupDetailE2eSeed.enrollmentId,
        subjectStatus: GetInternalGroupDetailE2eSeed.callStatus,
      }),
    ];

    expect(response.body.items).toEqual(expect.arrayContaining(expectedItems));
  });

  it('should return empty items with filter not found', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .query({ text: 'tomate' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 0,
    });
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
