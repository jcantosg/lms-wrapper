import { GetAcademicProgramsByTitleE2eSeed } from '#test/e2e/sga/academic-offering/academic-program/get-academic-programs-by-title.e2e-seeds';
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
import { expectAcademicProgramsByTitle } from '#test/e2e/sga/academic-offering/academic-program/helpers';
import { GetAllAcademicProgramsE2eSeedDataConfig } from '#test/e2e/sga/academic-offering/seed-data-config/get-all-academic-programs.e2e-seed-data-config';

const path = `/title/${GetAcademicProgramsByTitleE2eSeed.titleId}/academic-programs`;

describe('/title/{{titleId}}/academic-programs (GET)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetAcademicProgramsByTitleE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetAcademicProgramsByTitleE2eSeed.superAdminUserEmail,
      GetAcademicProgramsByTitleE2eSeed.superAdminUserPassword,
    );
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });
  it('should return academic programs', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: 2,
    });

    expect(response.body.items).toEqual(
      expect.arrayContaining(
        expectAcademicProgramsByTitle(
          GetAllAcademicProgramsE2eSeedDataConfig.academicPrograms,
        ),
      ),
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});