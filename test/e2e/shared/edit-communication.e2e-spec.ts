import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { EditCommunicationE2eSeed } from '#test/e2e/shared/edit-communication.e2e-seed';
import { CommunicationSchema } from '#shared/infrastructure/config/schema/communication.schema';
import { Message } from '#shared/domain/value-object/message.value-object';

const path = `/communication/${EditCommunicationE2eSeed.communicationId}`;

const requestBody = {
  businessUnitIds: [EditCommunicationE2eSeed.businessUnitId],
  academicPeriodIds: [EditCommunicationE2eSeed.academicPeriodId],
  titleIds: [EditCommunicationE2eSeed.titleId],
  academicProgramIds: [EditCommunicationE2eSeed.academicProgramId],
  internalGroupIds: [EditCommunicationE2eSeed.internalGroupId],
  studentIds: [EditCommunicationE2eSeed.studentId],
  subject: 'asunto',
  shortDescription: 'descripción corta',
  body: 'cuerpo del mensaje',
  sendByEmail: false,
  publishOnBoard: false,
};

describe('/communication/{id} (put)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new EditCommunicationE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        EditCommunicationE2eSeed.superAdminUserEmail,
        EditCommunicationE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        EditCommunicationE2eSeed.adminUserEmail,
        EditCommunicationE2eSeed.adminUserPassword,
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

  it('should return bad request (empty body)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  it('should throw CommunicationNotFoundException', async () => {
    const response = await supertest(httpServer)
      .put('/communication/4c347b78-4f79-4cce-8d83-b48d17d6c52e')
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send(requestBody)
      .expect(404);

    expect(response.body.message).toBe('student-360.communication.not-found');
  });

  it('should edit a communication', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send(requestBody)
      .expect(200);

    const repository = datasource.getRepository(CommunicationSchema);
    const communication = await repository.findOne({
      where: { id: EditCommunicationE2eSeed.communicationId },
    });
    expect(communication?.message).toEqual(
      new Message({
        subject: 'asunto',
        shortDescription: 'descripción corta',
        body: 'cuerpo del mensaje',
      }),
    );
    expect(communication?.publishOnBoard).toEqual(false);
    expect(communication?.sendByEmail).toEqual(false);
    expect(response.body).toEqual({ studentCount: 1 });
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
