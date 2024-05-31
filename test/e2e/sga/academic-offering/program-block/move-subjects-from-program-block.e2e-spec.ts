import { MoveSubjectsFromProgramBlockE2eSeed } from './move-subjects-from-program-block.e2e-seed';
import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';

const path = (blockId: string) => `/program-block/${blockId}/move-subject`;

describe('/program-block/:id/move-subject (PUT)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new MoveSubjectsFromProgramBlockE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      MoveSubjectsFromProgramBlockE2eSeed.superAdminUserEmail,
      MoveSubjectsFromProgramBlockE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      MoveSubjectsFromProgramBlockE2eSeed.adminUserEmail,
      MoveSubjectsFromProgramBlockE2eSeed.adminUserPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer)
      .put(path(MoveSubjectsFromProgramBlockE2eSeed.programBlock1Id))
      .expect(401);
  });

  it('should return forbidden', async () => {
    await supertest(httpServer)
      .put(path(MoveSubjectsFromProgramBlockE2eSeed.programBlock1Id))
      .auth(adminAccessToken, { type: 'bearer' })
      .send({
        subjectIds: [MoveSubjectsFromProgramBlockE2eSeed.subjectId],
        newBlockId: MoveSubjectsFromProgramBlockE2eSeed.programBlock2Id,
      })
      .expect(403);
  });

  it('should throw bad request', async () => {
    await supertest(httpServer)
      .put(path(MoveSubjectsFromProgramBlockE2eSeed.programBlock1Id))
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  it('should move a subject from one program block to another', async () => {
    await supertest(httpServer)
      .put(path(MoveSubjectsFromProgramBlockE2eSeed.programBlock1Id))
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        subjectIds: [MoveSubjectsFromProgramBlockE2eSeed.subjectId],
        newBlockId: MoveSubjectsFromProgramBlockE2eSeed.programBlock2Id,
      })
      .expect(200);
    const programBlock1 = await datasource.getRepository(ProgramBlock).findOne({
      where: { id: MoveSubjectsFromProgramBlockE2eSeed.programBlock1Id },
      relations: { subjects: true },
    });
    const programBlock2 = await datasource.getRepository(ProgramBlock).findOne({
      where: { id: MoveSubjectsFromProgramBlockE2eSeed.programBlock2Id },
      relations: { subjects: true },
    });
    expect(programBlock1!.subjects).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({
          _id: MoveSubjectsFromProgramBlockE2eSeed.subjectId,
        }),
      ]),
    );
    expect(programBlock2!.subjects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: MoveSubjectsFromProgramBlockE2eSeed.subjectId,
          _name: MoveSubjectsFromProgramBlockE2eSeed.subjectName,
        }),
      ]),
    );
  });

  it('should throw a Subject Not Found Exception', async () => {
    const response = await supertest(httpServer)
      .put(path(MoveSubjectsFromProgramBlockE2eSeed.programBlock1Id))
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        subjectIds: ['ad1b657b-c378-4b55-a97f-d5050856ea90'],
        newBlockId: MoveSubjectsFromProgramBlockE2eSeed.programBlock2Id,
      })
      .expect(404);
    expect(response.body.message).toBe('sga.subject.not-found');
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
