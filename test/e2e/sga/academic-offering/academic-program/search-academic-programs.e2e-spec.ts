import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import { GetAllAcademicProgramsE2eSeed } from '#test/e2e/sga/academic-offering/academic-program/get-all-academic-programs.e2e-seeds';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import {
  DEFAULT_LIMIT,
  FIRST_PAGE,
} from '#/sga/shared/application/collection.query';
import { expectAcademicPrograms } from '#test/e2e/sga/academic-offering/academic-program/helpers';
import { GetAllAcademicProgramsE2eSeedDataConfig } from '#test/e2e/sga/academic-offering/seed-data-config/get-all-academic-programs.e2e-seed-data-config';

const path = '/academic-program/search';

describe('/academic-program/search (GET)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetAllAcademicProgramsE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetAllAcademicProgramsE2eSeed.superAdminUserEmail,
      GetAllAcademicProgramsE2eSeed.superAdminUserPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });
  it('should return items', async () => {
    const response = await supertest(httpServer)
      .get(`${path}?text=Web`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: 2,
    });

    expect(response.body.items).toEqual(
      expect.arrayContaining(
        expectAcademicPrograms(
          GetAllAcademicProgramsE2eSeedDataConfig.academicPrograms,
        ),
      ),
    );
  });
  it('should return an empty array', async () => {
    const response = await supertest(httpServer)
      .get(`${path}?text=Matematicas`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: 0,
    });

    expect(response.body.items).toEqual(expect.arrayContaining([]));
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
