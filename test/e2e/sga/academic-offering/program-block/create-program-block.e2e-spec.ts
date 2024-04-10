import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import datasource from '#config/ormconfig';
import { startApp } from '#test/e2e/e2e-helper';
import { CreateProgramBlockE2eSeed } from '#test/e2e/sga/academic-offering/program-block/create-program-block.e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { AcademicProgramPostgresRepository } from '#academic-offering/infrastructure/repository/academic-program.postgres-repository';

const path = '/program-block';

describe('/program-block (POST)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let gestor360AccessToken: string;
  let secretariaAccessToken: string;
  let academicProgramRepository: AcademicProgramRepository;

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
        academicProgramId: CreateProgramBlockE2eSeed.academicProgramId,
        structureType: ProgramBlockStructureType.CUSTOM,
        blocks: ['f21a8bdf-e93d-4c1c-8a9f-6b07b36a0596'],
      })
      .expect(404);

    expect(response.body.message).toBe('sga.academic-program.not-found');
  });

  it('should return 409 when block ids are equals', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        academicProgramId: CreateProgramBlockE2eSeed.academicProgramId,
        structureType: ProgramBlockStructureType.CUSTOM,
        blocks: [
          'f21a8bdf-e93d-4c1c-8a9f-6b07b36a0596',
          'f21a8bdf-e93d-4c1c-8a9f-6b07b36a0596',
        ],
      })
      .expect(409);

    expect(response.body.message).toBe('sga.program-block.duplicated');
  });

  it('should create a program block', async () => {
    academicProgramRepository = new AcademicProgramPostgresRepository(
      datasource.getRepository(academicProgramSchema),
    );

    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        academicProgramId: CreateProgramBlockE2eSeed.academicProgramId,
        structureType: ProgramBlockStructureType.CUSTOM,
        blocks: ['f21a8bdf-e93d-4c1c-8a9f-6b07b36a0596'],
      })
      .expect(201);

    const academicProgram = await academicProgramRepository.get(
      CreateProgramBlockE2eSeed.academicProgramId,
    );

    expect(academicProgram?.programBlocks).toHaveLength(1);
    expect(academicProgram?.programBlocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'f21a8bdf-e93d-4c1c-8a9f-6b07b36a0596',
          name: 'Bloque 1',
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
