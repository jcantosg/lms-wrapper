import supertest from 'supertest';
import { AddAcademicProgramToPeriodicAcademicE2eSeed } from '#test/e2e/sga/academic-offering/academic-period/add-academic-program-to-periodic-academic-e2e-seed';
import datasource from '#config/ormconfig';
import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { startApp } from '#test/e2e/e2e-helper';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { AcademicPeriodPostgresRepository } from '#academic-offering/infrastructure/repository/academic-period.postgres-repository';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';

const path = `/academic-period/${AddAcademicProgramToPeriodicAcademicE2eSeed.academicPeriodId}/add-academic-program`;

describe('/academic-period/:id/add-academic-program (PUT)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let gestor360AccessToken: string;
  let secretariaAccessToken: string;
  let academicPeriodRepository: AcademicPeriodRepository;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new AddAcademicProgramToPeriodicAcademicE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      AddAcademicProgramToPeriodicAcademicE2eSeed.superAdminUserEmail,
      AddAcademicProgramToPeriodicAcademicE2eSeed.superAdminUserPassword,
    );

    gestor360AccessToken = await login(
      httpServer,
      AddAcademicProgramToPeriodicAcademicE2eSeed.adminUserGestor360Email,
      AddAcademicProgramToPeriodicAcademicE2eSeed.adminUserGestor360Password,
    );

    secretariaAccessToken = await login(
      httpServer,
      AddAcademicProgramToPeriodicAcademicE2eSeed.adminUserSecretariaEmail,
      AddAcademicProgramToPeriodicAcademicE2eSeed.adminUserSecretariaPassword,
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

  it('should return 404 when academic period (bu) not in business units requester', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(gestor360AccessToken, { type: 'bearer' })
      .send({
        academicProgramId:
          AddAcademicProgramToPeriodicAcademicE2eSeed.academicProgramId,
      })
      .expect(404);

    expect(response.body.message).toBe('sga.academic-period.not-found');
  });

  it('should return 404 when academic program not found', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        academicProgramId: 'f1514159-d648-4382-9037-89cdd012b9ac',
      })
      .expect(404);

    expect(response.body.message).toBe('sga.academic-program.not-found');
  });

  it('should return 404 when academic program(bu) is not same then academic period(bu)', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        academicProgramId:
          AddAcademicProgramToPeriodicAcademicE2eSeed.academicProgramId2,
      })
      .expect(404);

    expect(response.body.message).toBe('sga.academic-program.not-found');
  });

  it('should add academic program to academic period', async () => {
    academicPeriodRepository = new AcademicPeriodPostgresRepository(
      datasource.getRepository(academicPeriodSchema),
    );

    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        academicProgramId:
          AddAcademicProgramToPeriodicAcademicE2eSeed.academicProgramId,
      })
      .expect(200);

    const academicPeriod = await academicPeriodRepository.get(
      AddAcademicProgramToPeriodicAcademicE2eSeed.academicPeriodId,
    );

    expect(academicPeriod?.academicPrograms).toHaveLength(1);
    expect(academicPeriod?.academicPrograms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: AddAcademicProgramToPeriodicAcademicE2eSeed.academicProgramId,
          name: AddAcademicProgramToPeriodicAcademicE2eSeed.academicProgramName,
        }),
      ]),
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
