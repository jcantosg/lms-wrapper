import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { GetAcademicProgramDetailE2eSeed } from '#test/e2e/sga/academic-offering/academic-program/get-academic-program-detail.e2e-seed';

const path = `/academic-program/${GetAcademicProgramDetailE2eSeed.academicProgramId}`;

describe('Get Academic Program Detail (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminUserToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetAcademicProgramDetailE2eSeed(datasource);
    await seeder.arrange();
    superAdminUserToken = await login(
      httpServer,
      GetAcademicProgramDetailE2eSeed.superAdminEmail,
      GetAcademicProgramDetailE2eSeed.superAdminPassword,
    );
  });

  it('Should return Unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('Should return a 404', async () => {
    await supertest(httpServer)
      .get('/academicProgram/68d03278-df64-4afa-a482-89336197243e')
      .auth(superAdminUserToken, { type: 'bearer' })
      .expect(404);
  });

  it('Should return an academicProgram', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminUserToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: GetAcademicProgramDetailE2eSeed.academicProgramId,
        name: GetAcademicProgramDetailE2eSeed.academicProgramName,
        code: GetAcademicProgramDetailE2eSeed.academicProgramCode,
        title: {
          id: GetAcademicProgramDetailE2eSeed.titleId,
          name: GetAcademicProgramDetailE2eSeed.titleName,
          officialCode: GetAcademicProgramDetailE2eSeed.titleOfficialCode,
        },
        businessUnit: {
          id: GetAcademicProgramDetailE2eSeed.businessUnitId,
          name: GetAcademicProgramDetailE2eSeed.businessUnitName,
        },
        programBlocks: [],
      }),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
