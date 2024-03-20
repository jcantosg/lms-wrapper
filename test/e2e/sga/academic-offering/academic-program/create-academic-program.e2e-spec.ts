import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { CreateAcademicProgramE2eSeed } from '#test/e2e/sga/academic-offering/academic-program/create-academic-program.e2e-seeds';

const path = '/academic-program';

describe('/academic-program (POST)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new CreateAcademicProgramE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      CreateAcademicProgramE2eSeed.superAdminUserEmail,
      CreateAcademicProgramE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      CreateAcademicProgramE2eSeed.adminUserEmail,
      CreateAcademicProgramE2eSeed.adminUserPassword,
    );
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).post(path).expect(401);
  });
  it('should return forbidden', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });
  it('should return bad request', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });
  it('should create an academic program', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateAcademicProgramE2eSeed.academicProgramId,
        name: 'name',
        code: 'code',
        title: CreateAcademicProgramE2eSeed.titleId,
        businessUnit: CreateAcademicProgramE2eSeed.businessUnitId,
      })
      .expect(201);
  });
  it('should throw a duplicated error', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateAcademicProgramE2eSeed.academicProgramId,
        name: 'name',
        code: 'code',
        title: CreateAcademicProgramE2eSeed.titleId,
        businessUnit: CreateAcademicProgramE2eSeed.businessUnitId,
      })
      .expect(409);
    expect(response.body.message).toEqual('sga.academic-program.duplicated');
  });
  it('should throw a duplicated code error', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateAcademicProgramE2eSeed.secondAcademicProgramId,
        name: 'name',
        code: 'code',
        title: CreateAcademicProgramE2eSeed.titleId,
        businessUnit: CreateAcademicProgramE2eSeed.businessUnitId,
      })
      .expect(409);
    expect(response.body.message).toEqual(
      'sga.academic-program.duplicated-code',
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
