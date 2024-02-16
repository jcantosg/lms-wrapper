import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '&/config/ormconfig';
import supertest from 'supertest';
import {
  DEFAULT_LIMIT,
  FIRST_PAGE,
} from '#/sga/shared/application/collection.query';
import { GetAllExaminationCentersE2eSeedDataConfig } from '#test/e2e/sga/business-unit/seed-data-config/get-all-examination-centers.e2e-seed-data-config';
import { GetAllExaminationCentersE2eSeed } from '#test/e2e/sga/business-unit/examination-center/get-all-examination-center.e2e-seed';

const path = '/examination-center/search';

describe('/examination-center/search', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  const expectBusinessUnitsResponse = () => {
    return expect.arrayContaining([
      expect.objectContaining({
        id: GetAllExaminationCentersE2eSeedDataConfig.businessUnit.id,
        name: GetAllExaminationCentersE2eSeedDataConfig.businessUnit.name,
      }),
    ]);
  };

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetAllExaminationCentersE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetAllExaminationCentersE2eSeedDataConfig.superAdmin.email,
      GetAllExaminationCentersE2eSeedDataConfig.superAdmin.password,
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

  it('should return 400 with empty query param', async () => {
    await supertest(httpServer)
      .get(path)
      .query({
        text: '',
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });

  it('should return examination centers with page and limit default and query param text', async () => {
    const value = 'test';
    const response = await supertest(httpServer)
      .get(path)
      .query({
        text: value,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total:
        GetAllExaminationCentersE2eSeedDataConfig.examinationCenters.length,
    });

    const expectedItems =
      GetAllExaminationCentersE2eSeedDataConfig.examinationCenters.map(
        (examinationCenter) =>
          expect.objectContaining({
            id: examinationCenter.id,
            name: examinationCenter.name,
            code: examinationCenter.code,
            isActive: true,
            businessUnits: expectBusinessUnitsResponse(),
          }),
      );

    expect(response.body.items).toEqual(expect.arrayContaining(expectedItems));
  });

  it('should return examination centers with page and limit default and query param text', async () => {
    const value = 'exCenter_1';
    const response = await supertest(httpServer)
      .get(path)
      .query({
        text: value,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.pagination).toEqual({
      page: FIRST_PAGE,
      limit: DEFAULT_LIMIT,
      total: 1,
    });

    expect(response.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: GetAllExaminationCentersE2eSeedDataConfig.examinationCenters[0]
            .id,
          name: GetAllExaminationCentersE2eSeedDataConfig.examinationCenters[0]
            .name,
          code: GetAllExaminationCentersE2eSeedDataConfig.examinationCenters[0]
            .code,
          isActive: true,
          businessUnits: expectBusinessUnitsResponse(),
        }),
      ]),
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
