import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { PeriodBlockRepository } from '#academic-offering/domain/repository/period-block.repository';
import { PeriodBlockPostgresRepository } from '#academic-offering/infrastructure/repository/period-block.postgres-repository';
import { periodBlockSchema } from '#academic-offering/infrastructure/config/schema/period-block.schema';
import { EditPeriodBlockE2eSeed } from '#test/e2e/sga/academic-offering/academic-period/edit-period-block.e2e-seed';

const path = '/period-block/7baf9fc5-8976-4780-aa07-c0dfb420e230';
const wrongPath = '/period-block/6fe5450c-4830-41cb-9e86-1c0ef1bdd5e5';

describe('/period-block/:id (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let superAdminAccessToken: string;
  let periodBlockRepository: PeriodBlockRepository;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new EditPeriodBlockE2eSeed(datasource);
    await seeder.arrange();
    [adminAccessToken, superAdminAccessToken] = await Promise.all([
      login(
        httpServer,
        EditPeriodBlockE2eSeed.adminUserEmail,
        EditPeriodBlockE2eSeed.adminUserPassword,
      ),
      login(
        httpServer,
        EditPeriodBlockE2eSeed.superAdminUserEmail,
        EditPeriodBlockE2eSeed.superAdminUserPassword,
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

  it('should return 404 when period block does not exist', async () => {
    await supertest(httpServer)
      .put(wrongPath)
      .send({
        startDate: new Date('2024-12-12'),
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

  it('should edit the period block', async () => {
    periodBlockRepository = new PeriodBlockPostgresRepository(
      datasource.getRepository(periodBlockSchema),
    );
    await supertest(httpServer)
      .put(path)
      .send({
        startDate: new Date('2024-08-30'),
      })
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const periodBlock = await periodBlockRepository.get(
      EditPeriodBlockE2eSeed.periodBlockId,
    );
    const previousPeriodBlock = await periodBlockRepository.get(
      EditPeriodBlockE2eSeed.anotherPeriodBlockId,
    );

    expect(periodBlock?.startDate.toISOString()).toStrictEqual(
      new Date('2024-08-30').toISOString(),
    );
    expect(previousPeriodBlock?.endDate.toISOString()).toStrictEqual(
      new Date('2024-08-30').toISOString(),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
