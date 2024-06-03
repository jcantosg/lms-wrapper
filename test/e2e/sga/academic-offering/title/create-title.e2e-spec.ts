import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { CreateTitleE2eSeed } from '#test/e2e/sga/academic-offering/title/create-title.e2e-seed';

const path = '/title';
describe('/title (POST)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new CreateTitleE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        CreateTitleE2eSeed.superAdminUserEmail,
        CreateTitleE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        CreateTitleE2eSeed.adminUserEmail,
        CreateTitleE2eSeed.adminUserPassword,
      ),
    ]);
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
  it('should create a title', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateTitleE2eSeed.newTitleId,
        name: CreateTitleE2eSeed.titleName,
        officialCode: CreateTitleE2eSeed.titleOfficialCode,
        officialTitle: CreateTitleE2eSeed.titleOfficialTitle,
        officialProgram: CreateTitleE2eSeed.titleOfficialProgram,
        businessUnit: CreateTitleE2eSeed.businessUnitId,
      })
      .expect(201);
  });

  it('should throw a duplicated title error', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateTitleE2eSeed.existingTitleId,
        name: CreateTitleE2eSeed.titleName,
        officialCode: CreateTitleE2eSeed.titleOfficialCode,
        officialTitle: CreateTitleE2eSeed.titleOfficialTitle,
        officialProgram: CreateTitleE2eSeed.titleOfficialProgram,
        businessUnit: CreateTitleE2eSeed.businessUnitId,
      })
      .expect(409);
    expect(response.body.message).toBe('sga.title.duplicated');
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
