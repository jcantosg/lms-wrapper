import { RemoveSubjectCallE2eSeed } from '#test/e2e/sga/student/subject-call/remove-subject-call.e2e-seed';
import { HttpServer } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { Repository } from 'typeorm';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { subjectCallSchema } from '#student/infrastructure/config/schema/subject-call.schema';

const path = `/subject-call/${RemoveSubjectCallE2eSeed.subjectCallId}`;

describe('/subject-call/:id (DELETE)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  let subjectCallRepository: Repository<SubjectCall>;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new RemoveSubjectCallE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        RemoveSubjectCallE2eSeed.superAdminUserEmail,
        RemoveSubjectCallE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        RemoveSubjectCallE2eSeed.adminUserEmail,
        RemoveSubjectCallE2eSeed.adminUserPassword,
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

  it('should throw an SubjectCallNotFoundException', async () => {
    const response = await supertest(httpServer)
      .delete(`/subject-call/654f1804-52d0-4b69-9339-3176b5bf45e4`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);

    expect(response.body.message).toBe('sga.subject-call.not-found');
  });

  it('should throw an SubjectCallAlreadyPassedException', async () => {
    const response = await supertest(httpServer)
      .delete(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(409);

    expect(response.body.message).toBe('sga.subject-call.already-evaluated');
  });

  it('should remove the subject call', async () => {
    subjectCallRepository = datasource.getRepository(subjectCallSchema);

    await supertest(httpServer)
      .delete(`/subject-call/${RemoveSubjectCallE2eSeed.secondSubjectCallId}`)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    const subjectCall = await subjectCallRepository.findOne({
      where: {
        id: RemoveSubjectCallE2eSeed.secondSubjectCallId,
      },
    });

    expect(subjectCall).toBeNull();
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
