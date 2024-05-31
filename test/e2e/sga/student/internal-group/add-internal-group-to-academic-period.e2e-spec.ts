import { HttpServer, INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import datasource from '#config/ormconfig';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { Repository } from 'typeorm';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { AddInternalGroupToAcademicPeriodE2eSeed } from '#test/e2e/sga/student/internal-group/add-internal-group-to-academic-period.e2e-seed';

const path = '/internal-group';

describe('/internal-group (POST)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  let internalGroupRepository: Repository<InternalGroup>;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new AddInternalGroupToAcademicPeriodE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      AddInternalGroupToAcademicPeriodE2eSeed.superAdminUserEmail,
      AddInternalGroupToAcademicPeriodE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      AddInternalGroupToAcademicPeriodE2eSeed.adminUserEmail,
      AddInternalGroupToAcademicPeriodE2eSeed.adminUserPassword,
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
        id: AddInternalGroupToAcademicPeriodE2eSeed.internalGroupId,
        academicPeriodId: '4bc9cbfc-decf-4546-b4ac-483a93b8a33f',
        academicProgramId:
          AddInternalGroupToAcademicPeriodE2eSeed.academicProgramId,
        subjectId: AddInternalGroupToAcademicPeriodE2eSeed.subjectId,
        edaeUserIds: [],
        isDefaultGroup: false,
      })
      .expect(404);

    expect(response.body.message).toEqual('sga.academic-period.not-found');
  });

  it('should return 404 academic program not found', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: AddInternalGroupToAcademicPeriodE2eSeed.internalGroupId,
        academicPeriodId:
          AddInternalGroupToAcademicPeriodE2eSeed.academicPeriodId,
        academicProgramId: '4bc9cbfc-decf-4546-b4ac-483a93b8a33f',
        subjectId: AddInternalGroupToAcademicPeriodE2eSeed.subjectId,
        edaeUserIds: [],
        isDefaultGroup: false,
      })
      .expect(404);

    expect(response.body.message).toEqual('sga.academic-program.not-found');
  });

  it('should return 404 subject not found', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: AddInternalGroupToAcademicPeriodE2eSeed.internalGroupId,
        academicPeriodId:
          AddInternalGroupToAcademicPeriodE2eSeed.academicPeriodId,
        academicProgramId:
          AddInternalGroupToAcademicPeriodE2eSeed.academicProgramId,
        subjectId: '4bc9cbfc-decf-4546-b4ac-483a93b8a33f',
        edaeUserIds: [],
        isDefaultGroup: false,
      })
      .expect(404);

    expect(response.body.message).toEqual('sga.subject.not-found');
  });

  it('should return 404 subject not found', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: AddInternalGroupToAcademicPeriodE2eSeed.internalGroupId,
        academicPeriodId:
          AddInternalGroupToAcademicPeriodE2eSeed.academicPeriodId,
        academicProgramId:
          AddInternalGroupToAcademicPeriodE2eSeed.academicProgramId,
        subjectId: AddInternalGroupToAcademicPeriodE2eSeed.subjectId,
        edaeUserIds: ['4bc9cbfc-decf-4546-b4ac-483a93b8a33f'],
        isDefaultGroup: false,
      })
      .expect(404);

    expect(response.body.message).toEqual('sga.edae-user.not-found');
  });

  it('should create internal group', async () => {
    internalGroupRepository = datasource.getRepository(InternalGroup);

    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: AddInternalGroupToAcademicPeriodE2eSeed.internalGroupId,
        academicPeriodId:
          AddInternalGroupToAcademicPeriodE2eSeed.academicPeriodId,
        academicProgramId:
          AddInternalGroupToAcademicPeriodE2eSeed.academicProgramId,
        subjectId: AddInternalGroupToAcademicPeriodE2eSeed.subjectId,
        edaeUserIds: [AddInternalGroupToAcademicPeriodE2eSeed.edaeUserId],
        isDefaultGroup: false,
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
