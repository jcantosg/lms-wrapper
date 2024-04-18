import { AddSubjectToProgramBlockE2eSeed } from '#test/e2e/sga/academic-offering/program-block/add-subject-to-program-block.e2e-seeds';
import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';

const path = `/program-block/${AddSubjectToProgramBlockE2eSeed.programBlockId}/add-subject`;

describe('/program-block/id/add-subject (POST)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new AddSubjectToProgramBlockE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      AddSubjectToProgramBlockE2eSeed.superAdminUserEmail,
      AddSubjectToProgramBlockE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      AddSubjectToProgramBlockE2eSeed.adminUserEmail,
      AddSubjectToProgramBlockE2eSeed.adminUserPassword,
    );
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
  it('should throw bad request', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });
  it('should add a subject to a program block', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({ subjectId: AddSubjectToProgramBlockE2eSeed.subjectId })
      .expect(200);
    const programBlock = await datasource.getRepository(ProgramBlock).findOne({
      where: { id: AddSubjectToProgramBlockE2eSeed.programBlockId },
      relations: { subjects: true },
    });
    expect(programBlock!.subjects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: AddSubjectToProgramBlockE2eSeed.subjectId,
          _name: AddSubjectToProgramBlockE2eSeed.subjectName,
        }),
      ]),
    );
  });
  it('should throw a Subject Not Found Exception', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({ subjectId: AddSubjectToProgramBlockE2eSeed.programBlockId })
      .expect(404);
    expect(response.body.message).toBe('sga.subject.not-found');
  });
  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
