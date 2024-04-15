import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import datasource from '#config/ormconfig';
import { startApp } from '#test/e2e/e2e-helper';
import { CreateProgramBlockE2eSeed } from '#test/e2e/sga/academic-offering/program-block/create-program-block.e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { ProgramBlockPostgresRepository } from '#academic-offering/infrastructure/repository/program-block.postgres-repository';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';

const path = '/program-block';

describe('/program-block (POST)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let gestor360AccessToken: string;
  let secretariaAccessToken: string;
  let programBlockRepository: ProgramBlockRepository;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new CreateProgramBlockE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      CreateProgramBlockE2eSeed.superAdminUserEmail,
      CreateProgramBlockE2eSeed.superAdminUserPassword,
    );

    gestor360AccessToken = await login(
      httpServer,
      CreateProgramBlockE2eSeed.adminUserGestor360Email,
      CreateProgramBlockE2eSeed.adminUserGestor360Password,
    );

    secretariaAccessToken = await login(
      httpServer,
      CreateProgramBlockE2eSeed.adminUserSecretariaEmail,
      CreateProgramBlockE2eSeed.adminUserSecretariaPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).post(path).expect(401);
  });

  it('should return bad request (empty body)', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  it('should return forbidden', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(secretariaAccessToken, { type: 'bearer' })
      .expect(403);
  });

  it('should return 404 when academic program (bu) not in business units requester', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(gestor360AccessToken, { type: 'bearer' })
      .send({
        id: CreateProgramBlockE2eSeed.programBlockId,
        name: 'Bloque 2',
        academicProgramId: CreateProgramBlockE2eSeed.academicProgramId,
      })
      .expect(404);

    expect(response.body.message).toBe('sga.academic-program.not-found');
  });

  it('should return 409 when block is duplicated', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateProgramBlockE2eSeed.programBlockId,
        name: 'Bloque 2',
        academicProgramId: CreateProgramBlockE2eSeed.academicProgramId,
      })
      .expect(409);

    expect(response.body.message).toBe('sga.program-block.duplicated');
  });

  it('should create a program block', async () => {
    programBlockRepository = new ProgramBlockPostgresRepository(
      datasource.getRepository(programBlockSchema),
    );

    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: '7d404f6e-cf40-4a78-87d1-db3b5c002b4a',
        name: 'Bloque 2',
        academicProgramId: CreateProgramBlockE2eSeed.academicProgramId,
      })
      .expect(201);

    const programBlock = await programBlockRepository.get(
      '7d404f6e-cf40-4a78-87d1-db3b5c002b4a',
    );

    expect(programBlock).toEqual(
      expect.objectContaining({
        id: '7d404f6e-cf40-4a78-87d1-db3b5c002b4a',
        name: 'Bloque 2',
      }),
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
