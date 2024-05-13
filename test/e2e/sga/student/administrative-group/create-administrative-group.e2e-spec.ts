import { HttpServer, INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import datasource from '#config/ormconfig';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { CreateAdministrativeGroupE2eSeed } from '#test/e2e/sga/student/administrative-group/create-administrative-group.e2e-seed';
import { Repository } from 'typeorm';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';

const path = '/administrative-group';

describe('/administrative-group (POST)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  let administrativeGroupRepository: Repository<AdministrativeGroup>;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new CreateAdministrativeGroupE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      CreateAdministrativeGroupE2eSeed.superAdminUserEmail,
      CreateAdministrativeGroupE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      CreateAdministrativeGroupE2eSeed.adminUserEmail,
      CreateAdministrativeGroupE2eSeed.adminUserPassword,
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
        academicProgramIds: [
          CreateAdministrativeGroupE2eSeed.academicProgramId,
        ],
        businessUnitId: CreateAdministrativeGroupE2eSeed.businessUnitId2,
        academicPeriodId: CreateAdministrativeGroupE2eSeed.academicPeriodId,
      })
      .expect(404);

    expect(response.body.message).toEqual('sga.academic-period.not-found');
  });

  it('should return 404 academic period not found when not asocciate with academic program', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        academicProgramIds: [
          CreateAdministrativeGroupE2eSeed.academicProgramId,
        ],
        businessUnitId: CreateAdministrativeGroupE2eSeed.businessUnitId,
        academicPeriodId: CreateAdministrativeGroupE2eSeed.academicPeriodId2,
      })
      .expect(404);

    expect(response.body.message).toEqual('sga.academic-period.not-found');
  });

  it('should create administrative groups', async () => {
    administrativeGroupRepository =
      datasource.getRepository(AdministrativeGroup);

    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        academicProgramIds: [
          CreateAdministrativeGroupE2eSeed.academicProgramId,
        ],
        businessUnitId: CreateAdministrativeGroupE2eSeed.businessUnitId,
        academicPeriodId: CreateAdministrativeGroupE2eSeed.academicPeriodId,
      })
      .expect(201);

    const administrativeGroups = await administrativeGroupRepository.find({});

    expect(administrativeGroups.length).toBe(2);
    expect(administrativeGroups[0].code).toBe('M-23-25_MAD-INAS_1');
    expect(administrativeGroups[1].code).toBe('M-23-25_MAD-INAS_2');
  });

  it('should throw a duplicated code error', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        academicProgramIds: [
          CreateAdministrativeGroupE2eSeed.academicProgramId,
        ],
        businessUnitId: CreateAdministrativeGroupE2eSeed.businessUnitId,
        academicPeriodId: CreateAdministrativeGroupE2eSeed.academicPeriodId,
      })
      .expect(409);

    expect(response.body.message).toEqual(
      'sga.administrative-group.duplicated-code',
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
