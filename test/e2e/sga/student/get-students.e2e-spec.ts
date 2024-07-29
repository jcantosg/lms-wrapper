import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { GetSearchStudentsE2eSeed } from '#test/e2e/sga/student/get-search-students.e2e-seeds';
import { login } from '#test/e2e/sga/e2e-auth-helper';

const path = '/student';

describe('/student (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetSearchStudentsE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetSearchStudentsE2eSeed.superAdminUserEmail,
      GetSearchStudentsE2eSeed.superAdminUserPassword,
    );
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });
  it('should return all students', async () => {
    const response = await supertest(httpServer)
      .get(`${path}?academicProgram=Desarrollo&name=juan`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        pagination: expect.objectContaining({
          limit: 10,
          page: 1,
          total: 1,
        }),
        items: expect.arrayContaining([
          expect.objectContaining({
            id: GetSearchStudentsE2eSeed.studentId,
            businessUnit: expect.arrayContaining([
              expect.objectContaining({
                id: GetSearchStudentsE2eSeed.businessUnitId,
                name: GetSearchStudentsE2eSeed.businessUnitName,
              }),
            ]),
            academicProgram: expect.arrayContaining([
              expect.objectContaining({
                id: GetSearchStudentsE2eSeed.academicProgramId,
                name: GetSearchStudentsE2eSeed.academicProgramName,
              }),
            ]),
          }),
        ]),
      }),
    );
  });
  it('should return empty items ', async () => {
    const response = await supertest(httpServer)
      .get(`${path}?academicProgram=Programa&name=juan&businessUnit=Murcia`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        items: expect.arrayContaining([]),
      }),
    );
  });
  afterAll(async () => {
    await seeder.clear();
  });
});
