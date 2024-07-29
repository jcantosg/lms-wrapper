import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { GetAcademicProgramDetailE2eSeed } from '#test/e2e/sga/academic-offering/academic-program/get-academic-program-detail.e2e-seed';

const path = `/academic-program/${GetAcademicProgramDetailE2eSeed.academicProgramId}/specialty`;
const wrongPath =
  '/academic-program/9e9ac9db-d986-4a93-9d2c-7d2e4dea2638/specialty';

describe('/academic-program/id/specialty (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetAcademicProgramDetailE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetAcademicProgramDetailE2eSeed.superAdminEmail,
      GetAcademicProgramDetailE2eSeed.superAdminPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should throw a AcademicProgramNotFoundException', async () => {
    const response = await supertest(httpServer)
      .get(wrongPath)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);

    expect(response.body.message).toEqual('sga.academic-program.not-found');
  });

  it('should return an array of subjects with type Specialty', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.length).toEqual(1);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: GetAcademicProgramDetailE2eSeed.specialtyId,
          name: GetAcademicProgramDetailE2eSeed.specialtyName,
          internalCode: GetAcademicProgramDetailE2eSeed.specialtyCode,
        }),
      ]),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
