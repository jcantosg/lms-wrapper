import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { AddSubjectToProgramBlockE2eSeed } from '#test/e2e/sga/academic-offering/program-block/add-subject-to-program-block.e2e-seeds';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';

const path = `/program-block/${AddSubjectToProgramBlockE2eSeed.programBlockId}/add-subject`;

describe('/program-block/id/add-subject (POST)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new AddSubjectToProgramBlockE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        AddSubjectToProgramBlockE2eSeed.superAdminUserEmail,
        AddSubjectToProgramBlockE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        AddSubjectToProgramBlockE2eSeed.adminUserEmail,
        AddSubjectToProgramBlockE2eSeed.adminUserPassword,
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
    const programBlock = await datasource
      .getRepository(programBlockSchema)
      .findOne({
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
  });
});
