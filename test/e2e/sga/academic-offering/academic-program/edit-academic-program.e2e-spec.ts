import { HttpServer, INestApplication } from '@nestjs/common';
import datasource from '#config/ormconfig';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { EditAcademicProgramE2eSeed } from '#test/e2e/sga/academic-offering/academic-program/edit-academic-program.e2e-seed';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { AcademicProgramPostgresRepository } from '#academic-offering/infrastructure/repository/academic-program.postgres-repository';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';

const path = `/academic-program/${EditAcademicProgramE2eSeed.academicProgramId}`;

describe('/academic-program/:id (PUT)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let gestor360AccessToken: string;
  let secretariaAccessToken: string;
  let academicProgramRepository: AcademicProgramRepository;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new EditAcademicProgramE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      EditAcademicProgramE2eSeed.superAdminUserEmail,
      EditAcademicProgramE2eSeed.superAdminUserPassword,
    );
    gestor360AccessToken = await login(
      httpServer,
      EditAcademicProgramE2eSeed.adminUserGestor360Email,
      EditAcademicProgramE2eSeed.adminUserGestor360Password,
    );

    secretariaAccessToken = await login(
      httpServer,
      EditAcademicProgramE2eSeed.adminUserSecretariaEmail,
      EditAcademicProgramE2eSeed.adminUserSecretariaPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });

  it('should return bad request (empty body)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  it('should return forbidden', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(secretariaAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('should return 409 duplicated code', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        name: 'Academic Program 1',
        code: EditAcademicProgramE2eSeed.academicProgramCode2,
        title: '8c7e7f77-9551-48f2-ab2e-004ef7547a36',
      })
      .expect(409);

    expect(response.body.message).toBe('sga.academic-program.duplicated-code');
  });

  it('should return 404 when academic program bu is not in bu requester', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(gestor360AccessToken, { type: 'bearer' })
      .send({
        name: 'Academic Program 1 changed',
        code: EditAcademicProgramE2eSeed.academicProgramCode,
        title: '6318c518-5894-4ed8-a4b1-0b0c505483de',
      })
      .expect(404);

    expect(response.body.message).toBe('sga.academic-program.not-found');
  });

  it('should return 404 when title bu is not in bu requester', async () => {
    const response = await supertest(httpServer)
      .put(`/academic-program/${EditAcademicProgramE2eSeed.academicProgramId2}`)
      .auth(gestor360AccessToken, { type: 'bearer' })
      .send({
        name: 'Academic Program 1 changed',
        code: 'code changed',
        title: EditAcademicProgramE2eSeed.titleId,
      })
      .expect(404);

    expect(response.body.message).toBe('sga.title.not-found');
  });

  it('should update an academic program', async () => {
    academicProgramRepository = new AcademicProgramPostgresRepository(
      datasource.getRepository(academicProgramSchema),
    );

    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        name: 'Academic Program 1 changed',
        code: 'code changed',
        title: EditAcademicProgramE2eSeed.titleId2,
      })
      .expect(200);

    const academicProgram = await academicProgramRepository.get(
      EditAcademicProgramE2eSeed.academicProgramId,
    );

    expect(academicProgram?.name).toBe('Academic Program 1 changed');
    expect(academicProgram?.code).toBe('code changed');
    expect(academicProgram?.title.id).toBe(EditAcademicProgramE2eSeed.titleId2);
    expect(academicProgram?.title.name).toBe(
      EditAcademicProgramE2eSeed.titleName2,
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
