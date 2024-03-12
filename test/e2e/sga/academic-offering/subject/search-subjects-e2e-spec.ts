import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import supertest from 'supertest';
import {
  DEFAULT_LIMIT,
  FIRST_PAGE,
} from '#/sga/shared/application/collection.query';
import { GetAllSubjectsE2eSeed } from '#test/e2e/sga/academic-offering/subject/get-all-subjects.e2e-seed';
import { AddBusinessUnitsToAdminUserE2eSeedDataConfig } from '#test/e2e/sga/admin-user/seed-data-config/add-business-units-to-admin-user.e2e-seed-data-config';
import { GetAllSubjectsE2eSeedDataConfig } from '#test/e2e/sga/academic-offering/seed-data-config/get-all-subjects.e2e-seed-data-config';
import { expectSubjects } from '#test/e2e/sga/academic-offering/subject/helpers';

const path = '/subject/search';

describe('/subject/search', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetAllSubjectsE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.superAdmin.email,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.superAdmin.password,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return 400 when query field doest not exist', async () => {
    await supertest(httpServer)
      .get(path)
      .query({
        name: 'test',
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });

  it('should return subjects with page and limit default and query param text', async () => {
    const text = '0123';
    const response = await supertest(httpServer)
      .get(path)
      .query({
        text,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const subjectsFilter = GetAllSubjectsE2eSeedDataConfig.subjects.filter(
      (subject) =>
        subject.name.includes(text) ||
        subject.code.includes(text) ||
        subject.officialCode?.includes(text),
    );

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: subjectsFilter.length,
    });

    const subjectsExpected = expectSubjects(subjectsFilter);
    expect(response.body.items).toEqual(
      expect.arrayContaining(subjectsExpected),
    );
  });

  afterAll(async () => {
    await app.close();
    await seeder.clear();
    await datasource.destroy();
  });
});
