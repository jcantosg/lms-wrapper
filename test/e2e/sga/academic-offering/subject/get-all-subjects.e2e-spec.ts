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

const path = '/subject/';
describe('/subject/', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let gestor360MurciaAccessToken: string;

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
    gestor360MurciaAccessToken = await login(
      httpServer,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.gestor360MurciaUser.email,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.gestor360MurciaUser.password,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return 400 when query field doest not exist', async () => {
    await supertest(httpServer)
      .get(path)
      .query({
        name2: 'test',
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });

  it('shuld return subjects with page and limit default with superadmin user', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: GetAllSubjectsE2eSeedDataConfig.subjects.length,
    });

    const subjectsExpected = expectSubjects(
      GetAllSubjectsE2eSeedDataConfig.subjects,
    );

    expect(response.body.items).toEqual(
      expect.arrayContaining(subjectsExpected),
    );
  });

  it('should return subjects empty with page 2 and limit default with superadmin user', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .query({
        page: 2,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: 2,
      limit: DEFAULT_LIMIT,
      total: GetAllSubjectsE2eSeedDataConfig.subjects.length,
    });

    expect(response.body.items).toEqual([]);
  });

  it('should return subjects with page and limit default with gestorMurcia360 user', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(gestor360MurciaAccessToken, { type: 'bearer' })
      .expect(200);

    const subjectsFilter = GetAllSubjectsE2eSeedDataConfig.subjects.filter(
      (subject) => subject.businessUnit === 'Murcia',
    );

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: GetAllSubjectsE2eSeedDataConfig.subjects.filter(
        (subject) => subject.businessUnit === 'Murcia',
      ).length,
    });

    const subjectsExpected = expectSubjects(subjectsFilter);

    expect(response.body.items).toEqual(
      expect.arrayContaining(subjectsExpected),
    );
  });

  it('should return subjects empty with query param name and evaluationType, businessUnit and name', async () => {
    const name = 'Administra';
    const evaluationType = '8adeb962-3669-4c37-ada0-01328ef74c00';
    const businessUnit = 'Madrid';

    const response = await supertest(httpServer)
      .get(path)
      .query({
        name,
        evaluationType,
        businessUnit,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const subjectsFilter = GetAllSubjectsE2eSeedDataConfig.subjects.filter(
      (subject) =>
        subject.name.includes(name) &&
        subject.evaluationType === evaluationType &&
        subject.businessUnit === businessUnit,
    );

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: subjectsFilter.length,
    });

    const expectedSubjects = expectSubjects(subjectsFilter);

    expect(response.body.items).toEqual(
      expect.arrayContaining(expectedSubjects),
    );
  });

  it('should return subjects with order by name asc', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .query({
        orderBy: 'name',
        orderType: 'ASC',
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const subjectsExpected = GetAllSubjectsE2eSeedDataConfig.subjects
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((subject) =>
        expect.objectContaining({
          id: subject.id,
          name: subject.name,
          code: subject.code,
          officialCode: subject.officialCode,
          modality: subject.modality,
          evaluationType: expect.objectContaining({
            id: subject.evaluationType,
          }),
          type: subject.type,
          businessUnit: expect.objectContaining({
            name: subject.businessUnit,
          }),
          isRegulated: subject.isRegulated,
        }),
      );

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: subjectsExpected.length,
    });

    expect(response.body.items).toEqual(
      expect.arrayContaining(subjectsExpected),
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
