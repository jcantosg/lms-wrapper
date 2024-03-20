import { AddEdaeUsersToSubjectE2eSeed } from '#test/e2e/sga/academic-offering/subject/add-edae-users-to-subject.e2e-seed';
import datasource from '#config/ormconfig';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { HttpServer, INestApplication } from '@nestjs/common';
import { startApp } from '#test/e2e/e2e-helper';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { SubjectPostgresRepository } from '#academic-offering/infrastructure/repository/subject.postgres-repository';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';

const path = `/subject/${AddEdaeUsersToSubjectE2eSeed.subjectId}/add-edae-user`;

describe('/subjects/:id/add-edae-user (POST)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let gestor360AccessToken: string;
  let secretariaAccessToken: string;
  let subjectRepository: SubjectRepository;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new AddEdaeUsersToSubjectE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      AddEdaeUsersToSubjectE2eSeed.superAdminUserEmail,
      AddEdaeUsersToSubjectE2eSeed.superAdminUserPassword,
    );

    gestor360AccessToken = await login(
      httpServer,
      AddEdaeUsersToSubjectE2eSeed.adminUserGestor360Email,
      AddEdaeUsersToSubjectE2eSeed.adminUserGestor360Password,
    );

    secretariaAccessToken = await login(
      httpServer,
      AddEdaeUsersToSubjectE2eSeed.adminUserSecretariaEmail,
      AddEdaeUsersToSubjectE2eSeed.adminUserSecretariaPassword,
    );
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
      .auth(secretariaAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('should return 404 when subject (bu) not in business units requester', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(gestor360AccessToken, { type: 'bearer' })
      .send({
        edaeUsers: ['eac6bfd9-ef47-493a-9e57-c01453f7ef2f'],
      })
      .expect(404);

    expect(response.body.message).toBe('sga.subject.not-found');
  });

  it('should return 404 when edae user (bu) not in business units requester', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        edaeUsers: [AddEdaeUsersToSubjectE2eSeed.edaeUserId],
      })
      .expect(404);

    expect(response.body.message).toBe('sga.edae-user.not-found');
  });

  it('should return 409 when edae user unique role is GESTOR FCT', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        edaeUsers: [AddEdaeUsersToSubjectE2eSeed.secondEdaeUserId],
      })
      .expect(409);

    expect(response.body.message).toBe('sga.subject.invalid-edae-user-role');
  });

  it('should add edae user to subject', async () => {
    subjectRepository = new SubjectPostgresRepository(
      datasource.getRepository(subjectSchema),
    );

    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        edaeUsers: [AddEdaeUsersToSubjectE2eSeed.thirdEdaeUserId],
      })
      .expect(200);

    const subject = await subjectRepository.get(
      AddEdaeUsersToSubjectE2eSeed.subjectId,
    );

    expect(subject?.teachers).toHaveLength(1);
    expect(subject?.teachers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: AddEdaeUsersToSubjectE2eSeed.thirdEdaeUserId,
          name: AddEdaeUsersToSubjectE2eSeed.thirdEdaeName,
        }),
      ]),
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
