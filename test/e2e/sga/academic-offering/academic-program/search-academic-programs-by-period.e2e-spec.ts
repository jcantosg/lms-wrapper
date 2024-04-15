import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import {
  DEFAULT_LIMIT,
  FIRST_PAGE,
} from '#/sga/shared/application/collection.query';
import { GetAllAcademicProgramsByAcademicPeriodE2eSeed } from '#test/e2e/sga/academic-offering/academic-program/get-all-academic-programs-by-period.e2e-seed';

const path = `/academic-period/${GetAllAcademicProgramsByAcademicPeriodE2eSeed.academicPeriodId}/academic-program/search?text=OC1`;

describe('GET /academic-period/:academicPeriodId/academic-program/search', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetAllAcademicProgramsByAcademicPeriodE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.superAdminUserMail,
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.superAdminUserPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return all academic programs for the given academic period', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: 1,
    });

    expect(response.body.items).toHaveLength(1);
  });

  it('should return 400 for invalid academic period id', async () => {
    const invalidId = 'not-a-number';
    await supertest(httpServer)
      .get(`/academic-period/${invalidId}/academic-program/search?text=OC1`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });

  it('should return 404 for non-existent academic period id', async () => {
    const nonExistentId = '79300ce0-00a0-4c41-82a7-080daed5c247';
    await supertest(httpServer)
      .get(`/academic-period/${nonExistentId}/academic-program/search?text=OC1`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
