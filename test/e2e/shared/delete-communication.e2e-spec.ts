import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { EditCommunicationE2eSeed } from '#test/e2e/shared/edit-communication.e2e-seed';
import { CommunicationSchema } from '#shared/infrastructure/config/schema/communication.schema';

const path = `/communication/${EditCommunicationE2eSeed.communicationId}`;
const worngPath = `/communication/${EditCommunicationE2eSeed.sentCommunicationId}`;

describe('/communication/{id} (delete)', () => {
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
    await supertest(httpServer).delete(path).expect(401);
  });

  it('should return forbidden', async () => {
    await supertest(httpServer)
      .delete(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('should return bad request (invalid id)', async () => {
    await supertest(httpServer)
      .delete('/communication/123')
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(400);
  });

  it('should throw CommunicationNotFoundException', async () => {
    const response = await supertest(httpServer)
      .delete('/communication/4c347b78-4f79-4cce-8d83-b48d17d6c52e')
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);

    expect(response.body.message).toBe('student-360.communication.not-found');
  });

  it('should throw CommunicationAlreadySentException', async () => {
    const response = await supertest(httpServer)
      .delete(worngPath)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(409);

    expect(response.body.message).toBe('sga.communication.already-sent');
  });

  it('should delete a communication', async () => {
    await supertest(httpServer)
      .delete(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const repository = datasource.getRepository(CommunicationSchema);
    const communication = await repository.findOne({
      where: { id: EditCommunicationE2eSeed.communicationId },
    });
    expect(communication).toEqual(null);
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
