import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { RemoveEdaeUserFromSubjectE2eSeed } from '#test/e2e/sga/academic-offering/subject/remove-edae-user-from-subject.e2e-seed';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';
import { SubjectPostgresRepository } from '#academic-offering/infrastructure/repository/subject.postgres-repository';

const path = `/subject/${RemoveEdaeUserFromSubjectE2eSeed.subjectId}/remove-edae-user`;

describe('/subjects/:id/remove-edae-user (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let gestor360AccessToken: string;
  let adminUserToken: string;
  let subjectRepository: SubjectRepository;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new RemoveEdaeUserFromSubjectE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, gestor360AccessToken, adminUserToken] =
      await Promise.all([
        login(
          httpServer,
          RemoveEdaeUserFromSubjectE2eSeed.superAdminUserEmail,
          RemoveEdaeUserFromSubjectE2eSeed.superAdminUserPassword,
        ),
        login(
          httpServer,
          RemoveEdaeUserFromSubjectE2eSeed.adminUserGestor360Email,
          RemoveEdaeUserFromSubjectE2eSeed.adminUserGestor360Password,
        ),
        login(
          httpServer,
          RemoveEdaeUserFromSubjectE2eSeed.adminUserSecretariaEmail,
          RemoveEdaeUserFromSubjectE2eSeed.adminUserSecretariaPassword,
        ),
      ]);
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });

  it('should return bad request (empty body)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  it('should return forbidden', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(adminUserToken, { type: 'bearer' })
      .expect(403);
  });

  it('should return 404 when subject (bu) not in business units requester', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(gestor360AccessToken, { type: 'bearer' })
      .send({
        edaeUser: 'eac6bfd9-ef47-493a-9e57-c01453f7ef2f',
      })
      .expect(404);

    expect(response.body.message).toBe('sga.subject.not-found');
  });

  it('should return 404 when edae user doest not exists', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        edaeUser: '598820a8-6f41-45bd-9f54-4836a5f9fa0e',
      })
      .expect(404);

    expect(response.body.message).toBe('sga.edae-user.not-found');
  });

  it('should remove edae user from subject', async () => {
    subjectRepository = new SubjectPostgresRepository(
      datasource.getRepository(subjectSchema),
    );

    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        edaeUser: RemoveEdaeUserFromSubjectE2eSeed.edaeUserId,
      })
      .expect(200);

    const subject = await subjectRepository.get(
      RemoveEdaeUserFromSubjectE2eSeed.subjectId,
    );

    expect(subject?.teachers).toEqual([]);
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
