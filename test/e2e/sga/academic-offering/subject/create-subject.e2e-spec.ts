import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import { CreateSubjectE2eSeed } from '#test/e2e/sga/academic-offering/subject/create-subject.e2e-seeds';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';

const path = '/subject';
describe('/subject (POST)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let secretaryAccessToken: string;
  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new CreateSubjectE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      CreateSubjectE2eSeed.superAdminUserEmail,
      CreateSubjectE2eSeed.superAdminUserPassword,
    );
    secretaryAccessToken = await login(
      httpServer,
      CreateSubjectE2eSeed.adminUserEmail,
      CreateSubjectE2eSeed.adminUserPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).post(path).expect(401);
  });
  it('should return forbidden', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(secretaryAccessToken, { type: 'bearer' })
      .expect(403);
  });
  it('should return bad request', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });
  it('should create a subject', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateSubjectE2eSeed.subjectId,
        name: CreateSubjectE2eSeed.subjectName,
        code: CreateSubjectE2eSeed.subjectCode,
        hours: CreateSubjectE2eSeed.subjectHours,
        officialCode: CreateSubjectE2eSeed.subjectOfficialCode,
        modality: CreateSubjectE2eSeed.subjectModality,
        evaluationType: CreateSubjectE2eSeed.subjectEvaluationType,
        type: CreateSubjectE2eSeed.subjectType,
        businessUnit: CreateSubjectE2eSeed.businessUnitId,
        isRegulated: CreateSubjectE2eSeed.subjectIsRegulated,
        isCore: CreateSubjectE2eSeed.subjectIsCore,
        officialRegionalCode: CreateSubjectE2eSeed.subjectOfficialRegionalCode,
      })
      .expect(201);
  });

  it('should throw a duplicated code error', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateSubjectE2eSeed.secondSubjectId,
        name: CreateSubjectE2eSeed.subjectName,
        code: CreateSubjectE2eSeed.subjectCode,
        hours: CreateSubjectE2eSeed.subjectHours,
        officialCode: CreateSubjectE2eSeed.subjectOfficialCode,
        modality: CreateSubjectE2eSeed.subjectModality,
        evaluationType: CreateSubjectE2eSeed.subjectEvaluationType,
        type: CreateSubjectE2eSeed.subjectType,
        businessUnit: CreateSubjectE2eSeed.businessUnitId,
        isRegulated: CreateSubjectE2eSeed.subjectIsRegulated,
        isCore: CreateSubjectE2eSeed.subjectIsCore,
        officialRegionalCode: CreateSubjectE2eSeed.subjectOfficialRegionalCode,
      })
      .expect(409);
    expect(response.body.message).toBe('sga.subject.duplicated-code');
  });

  it('should throw a evaluation type not found error', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateSubjectE2eSeed.secondSubjectId,
        name: CreateSubjectE2eSeed.subjectName,
        code: CreateSubjectE2eSeed.secondSubjectCode,
        hours: CreateSubjectE2eSeed.subjectHours,
        officialCode: CreateSubjectE2eSeed.subjectOfficialCode,
        modality: CreateSubjectE2eSeed.subjectModality,
        evaluationType: 'd66ffa3e-22e4-48ca-aeea-0c3b37fc70c3',
        type: CreateSubjectE2eSeed.subjectType,
        businessUnit: CreateSubjectE2eSeed.businessUnitId,
        isRegulated: CreateSubjectE2eSeed.subjectIsRegulated,
        isCore: CreateSubjectE2eSeed.subjectIsCore,
        officialRegionalCode: CreateSubjectE2eSeed.subjectOfficialRegionalCode,
      })
      .expect(404);
    expect(response.body.message).toBe('sga.evaluation-type.not-found');
  });

  it('should throw a business unit not found error', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateSubjectE2eSeed.secondSubjectId,
        name: CreateSubjectE2eSeed.subjectName,
        code: CreateSubjectE2eSeed.secondSubjectCode,
        hours: CreateSubjectE2eSeed.subjectHours,
        officialCode: CreateSubjectE2eSeed.subjectOfficialCode,
        modality: CreateSubjectE2eSeed.subjectModality,
        evaluationType: CreateSubjectE2eSeed.subjectEvaluationType,
        type: CreateSubjectE2eSeed.subjectType,
        businessUnit: '46785f83-8f4b-4e3c-974f-3fea1f87d4b7',
        isRegulated: CreateSubjectE2eSeed.subjectIsRegulated,
        isCore: CreateSubjectE2eSeed.subjectIsCore,
        officialRegionalCode: CreateSubjectE2eSeed.subjectOfficialRegionalCode,
      })
      .expect(404);
    expect(response.body.message).toBe('sga.business-unit.not-found');
  });

  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
