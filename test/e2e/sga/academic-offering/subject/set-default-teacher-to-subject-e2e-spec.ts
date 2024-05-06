import { HttpServer, INestApplication } from '@nestjs/common';
import datasource from '#config/ormconfig';
import { SetDefaultTeacherToSubjectE2eSeed } from '#test/e2e/sga/academic-offering/subject/set-default-teacher-to-subject-e2e-seed';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { startApp } from '#test/e2e/e2e-helper';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { SubjectPostgresRepository } from '#academic-offering/infrastructure/repository/subject.postgres-repository';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';

const path = `/subject/${SetDefaultTeacherToSubjectE2eSeed.subjectId}/default-teacher`;

describe('/subjects/:id/default-teacher (PUT)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let secretariaAccessToken: string;
  let subjectRepository: SubjectRepository;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new SetDefaultTeacherToSubjectE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      SetDefaultTeacherToSubjectE2eSeed.superAdminUserEmail,
      SetDefaultTeacherToSubjectE2eSeed.superAdminUserPassword,
    );
    secretariaAccessToken = await login(
      httpServer,
      SetDefaultTeacherToSubjectE2eSeed.adminUserSecretariaEmail,
      SetDefaultTeacherToSubjectE2eSeed.adminUserSecretariaPassword,
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

  it('should return 404 edae user not found', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        teacherId: '2a4f91fd-d2db-454a-8165-c920d96bf722',
      })
      .expect(404);

    expect(response.body.message).toBe('sga.edae-user.not-found');
  });

  it('should return 409 invalid default teacher', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        teacherId: SetDefaultTeacherToSubjectE2eSeed.secondEdaeUserId,
      })
      .expect(409);

    expect(response.body.message).toBe('sga.subject.invalid-default-teacher');
  });

  it('should set default teacher to subject', async () => {
    subjectRepository = new SubjectPostgresRepository(
      datasource.getRepository(subjectSchema),
    );

    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        teacherId: SetDefaultTeacherToSubjectE2eSeed.edaeUserId,
      })
      .expect(200);

    const subject = await subjectRepository.get(
      SetDefaultTeacherToSubjectE2eSeed.subjectId,
    );

    expect(subject?.defaultTeacher?.id).toBe(
      SetDefaultTeacherToSubjectE2eSeed.edaeUserId,
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
