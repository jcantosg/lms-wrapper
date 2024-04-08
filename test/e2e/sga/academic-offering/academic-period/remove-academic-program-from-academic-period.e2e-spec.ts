import { HttpServer, INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { AcademicPeriodPostgresRepository } from '#academic-offering/infrastructure/repository/academic-period.postgres-repository';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';
import { RemoveAcademicProgramFromAcademicPeriodE2eSeed } from '#test/e2e/sga/academic-offering/academic-period/remove-academic-program-from-academic-period.e2e-seed';

const path =
  '/academic-period/7baf9fc5-8976-4780-aa07-c0dfb420e230/remove-academic-program';
const wrongPath =
  '/academic-period/6fe5450c-4830-41cb-9e86-1c0ef1bdd5e5/remove-academic-program';

describe('/academic-period/:id/remove-academic-program (PUT)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let superAdminAccessToken: string;
  let academicPeriodRepository: AcademicPeriodRepository;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new RemoveAcademicProgramFromAcademicPeriodE2eSeed(datasource);
    await seeder.arrange();
    adminAccessToken = await login(
      httpServer,
      RemoveAcademicProgramFromAcademicPeriodE2eSeed.adminUserEmail,
      RemoveAcademicProgramFromAcademicPeriodE2eSeed.adminUserPassword,
    );
    superAdminAccessToken = await login(
      httpServer,
      RemoveAcademicProgramFromAcademicPeriodE2eSeed.superAdminUserEmail,
      RemoveAcademicProgramFromAcademicPeriodE2eSeed.superAdminUserPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });

  it('should return forbidden', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('should return 404 when academic period does not exist', async () => {
    await supertest(httpServer)
      .put(wrongPath)
      .send({
        academicProgramId:
          RemoveAcademicProgramFromAcademicPeriodE2eSeed.academicProgramId,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);
  });

  it('should return 404 when academic program does not exist', async () => {
    await supertest(httpServer)
      .put(path)
      .send({
        academicProgramId: '6fe5450c-4830-41cb-9e86-1c0ef1bdd5e5',
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);
  });

  it('should return bad request when empty body', async () => {
    await supertest(httpServer)
      .put(path)
      .send({})
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });

  it('should remove an academic program from the academic period', async () => {
    academicPeriodRepository = new AcademicPeriodPostgresRepository(
      datasource.getRepository(academicPeriodSchema),
    );
    await supertest(httpServer)
      .put(path)
      .send({
        academicProgramId:
          RemoveAcademicProgramFromAcademicPeriodE2eSeed.academicProgramId,
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const academicPeriod = await academicPeriodRepository.get(
      RemoveAcademicProgramFromAcademicPeriodE2eSeed.academicPeriodId,
    );

    expect(academicPeriod?.academicPrograms).toHaveLength(0);
  });

  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
