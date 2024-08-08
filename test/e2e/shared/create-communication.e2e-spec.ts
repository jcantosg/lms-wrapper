import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { v4 as uuid } from 'uuid';
import { CreateCommunicationE2eSeed } from '#test/e2e/shared/create-communication.e2e-seed';

const path = `/communication`;

describe('/communication (POST)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new CreateCommunicationE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        CreateCommunicationE2eSeed.superAdminUserEmail,
        CreateCommunicationE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        CreateCommunicationE2eSeed.adminUserEmail,
        CreateCommunicationE2eSeed.adminUserPassword,
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

  it('should return bad request (empty body)', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  it('should create a communication', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: uuid(),
        businessUnitIds: [CreateCommunicationE2eSeed.businessUnitId],
        academicPeriodIds: [CreateCommunicationE2eSeed.academicPeriodId],
        titleIds: [CreateCommunicationE2eSeed.titleId],
        academicProgramIds: [CreateCommunicationE2eSeed.academicProgramId],
        internalGroupIds: [CreateCommunicationE2eSeed.internalGroupId],
        studentIds: [CreateCommunicationE2eSeed.studentId],
      })
      .expect(201);
  });

  it('should throw CommunicationDuplicatedException', async () => {
    const requestBody = {
      id: uuid(),
      businessUnitIds: [CreateCommunicationE2eSeed.businessUnitId],
      academicPeriodIds: [CreateCommunicationE2eSeed.academicPeriodId],
      titleIds: [CreateCommunicationE2eSeed.titleId],
      academicProgramIds: [CreateCommunicationE2eSeed.academicProgramId],
      internalGroupIds: [CreateCommunicationE2eSeed.internalGroupId],
      studentIds: [CreateCommunicationE2eSeed.studentId],
    };

    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send(requestBody)
      .expect(201);

    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send(requestBody)
      .expect(409);

    expect(response.body.message).toBe('sga.communication.duplicated');
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
