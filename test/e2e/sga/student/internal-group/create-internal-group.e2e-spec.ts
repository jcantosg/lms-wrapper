import { HttpServer, INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import datasource from '#config/ormconfig';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { Repository } from 'typeorm';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { CreateInternalGroupE2eSeed } from '#test/e2e/sga/student/internal-group/create-internal-group.e2e-seed';

const path = '/internal-group/batch';

describe('/internal-group/batch (POST)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  let internalGroupRepository: Repository<InternalGroup>;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new CreateInternalGroupE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      CreateInternalGroupE2eSeed.superAdminUserEmail,
      CreateInternalGroupE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      CreateInternalGroupE2eSeed.adminUserEmail,
      CreateInternalGroupE2eSeed.adminUserPassword,
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

  it('should return bad request (empty body)', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  it('should return 404 academic period not found', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        academicPeriodId: 'f20f1c3e-e3e6-452d-b4cb-e6d4cb039dbd',
        academicPrograms: [CreateInternalGroupE2eSeed.academicProgramId],
        isDefault: true,
      })
      .expect(404);

    expect(response.body.message).toEqual('sga.academic-period.not-found');
  });

  it('should return 404 academic program not found', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        academicPeriodId: CreateInternalGroupE2eSeed.academicPeriodId,
        academicPrograms: ['f20f1c3e-e3e6-452d-b4cb-e6d4cb039dbd'],
        isDefault: true,
      })
      .expect(404);

    expect(response.body.message).toEqual('sga.academic-program.not-found');
  });

  it('should create internal groups', async () => {
    internalGroupRepository = datasource.getRepository(InternalGroup);

    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        academicPeriodId: CreateInternalGroupE2eSeed.academicPeriodId,
        academicPrograms: [CreateInternalGroupE2eSeed.academicProgramId],
        isDefault: true,
      })
      .expect(201);

    const internalGroups = await internalGroupRepository.find({});

    expect(internalGroups.length).toBe(1);
    expect(internalGroups[0].code).toBe('MAD-INAScodeM-23-250');
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
