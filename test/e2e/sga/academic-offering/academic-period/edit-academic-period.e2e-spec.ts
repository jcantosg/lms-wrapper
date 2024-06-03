import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { AcademicPeriodPostgresRepository } from '#academic-offering/infrastructure/repository/academic-period.postgres-repository';
import { EditAcademicPeriodE2eSeed } from '#test/e2e/sga/academic-offering/academic-period/edit-academic-period.e2e-seed';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';

const path = '/academic-period/7baf9fc5-8976-4780-aa07-c0dfb420e230';
const wrongPath = '/academic-period/6fe5450c-4830-41cb-9e86-1c0ef1bdd5e5';

describe('/academic-period/:id (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let superAdminAccessToken: string;
  let academicPeriodRepository: AcademicPeriodRepository;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new EditAcademicPeriodE2eSeed(datasource);
    await seeder.arrange();
    [adminAccessToken, superAdminAccessToken] = await Promise.all([
      login(
        httpServer,
        EditAcademicPeriodE2eSeed.adminUserEmail,
        EditAcademicPeriodE2eSeed.adminUserPassword,
      ),
      login(
        httpServer,
        EditAcademicPeriodE2eSeed.superAdminUserEmail,
        EditAcademicPeriodE2eSeed.superAdminUserPassword,
      ),
    ]);
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
        name: 'TestBusinessUnit',
        code: 'TestBusinessCode',
        startDate: new Date('2024-12-12'),
        endDate: new Date('2025-12-12'),
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

  it('should edit the academic period', async () => {
    academicPeriodRepository = new AcademicPeriodPostgresRepository(
      datasource.getRepository(academicPeriodSchema),
    );
    await supertest(httpServer)
      .put(path)
      .send({
        name: 'TestAcademicPeriodName',
        code: 'TestAcademicPeriodCode',
        startDate: new Date('2024-12-12'),
        endDate: new Date('2025-12-12'),
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const academicPeriod = await academicPeriodRepository.get(
      EditAcademicPeriodE2eSeed.academicPeriodId,
    );

    expect(academicPeriod?.name).toBe('TestAcademicPeriodName');
    expect(academicPeriod?.code).toBe('TestAcademicPeriodCode');
    expect(academicPeriod?.startDate.toISOString()).toStrictEqual(
      new Date('2024-12-12').toISOString(),
    );
    expect(academicPeriod?.endDate.toISOString()).toStrictEqual(
      new Date('2025-12-12').toISOString(),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
