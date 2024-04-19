import { RemoveSubjectsFromProgramBlockE2eSeed } from '#test/e2e/sga/academic-offering/program-block/remove-subjects-from-program-block.e2e-seeds';
import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';

const path = `/program-block/${RemoveSubjectsFromProgramBlockE2eSeed.programBlockId}/remove-subject`;
const wrongPath = `/program-block/b595ba58-4e47-4ec6-9001-e236f9b28ea6/remove-subject`;

describe('/program-block/id/remove-subject (PUT)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new RemoveSubjectsFromProgramBlockE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      RemoveSubjectsFromProgramBlockE2eSeed.superAdminUserEmail,
      RemoveSubjectsFromProgramBlockE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      RemoveSubjectsFromProgramBlockE2eSeed.adminUserEmail,
      RemoveSubjectsFromProgramBlockE2eSeed.adminUserPassword,
    );
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });
  it('should return forbidden', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(adminAccessToken, { type: 'bearer' });
  });
  it('should throw SubjectNotFoundException', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        subjectIds: ['8bb64ac6-08ce-4fd5-8b6b-a62f0c8c2dca'],
      })
      .expect(404);
    expect(response.body.message).toEqual('sga.subject.not-found');
  });
  it('should throw a ProgramBlockNotFoundException', async () => {
    const response = await supertest(httpServer)
      .put(wrongPath)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        subjectIds: [RemoveSubjectsFromProgramBlockE2eSeed.subjectId],
      })
      .expect(404);
    expect(response.body.message).toEqual('sga.program-block.not-found');
  });
  it('should throw a bad request exception', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });
  it('should remove a subject from the block', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        subjectIds: [RemoveSubjectsFromProgramBlockE2eSeed.secondSubjectId],
      })
      .expect(200);

    const repository = datasource.getRepository(ProgramBlock);
    const programBlock = await repository.findOne({
      where: { id: RemoveSubjectsFromProgramBlockE2eSeed.programBlockId },
      relations: { subjects: true },
    });
    expect(programBlock!.subjects).toEqual(
      expect.arrayContaining([
        expect.not.objectContaining({
          _id: RemoveSubjectsFromProgramBlockE2eSeed.secondSubjectId,
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
