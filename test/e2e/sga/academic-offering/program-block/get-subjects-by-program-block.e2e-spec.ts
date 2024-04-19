import { GetSubjectsByProgramBlockE2eSeed } from '#test/e2e/sga/academic-offering/program-block/get-subjects-by-program-block.e2e-seeds';
import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';

const path = `/program-block/${GetSubjectsByProgramBlockE2eSeed.programBlockId}/subject`;
const wrongPath = '/program-block/9e9ac9db-d986-4a93-9d2c-7d2e4dea2638/subject';

describe('/program-block/id/subject (GET)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetSubjectsByProgramBlockE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetSubjectsByProgramBlockE2eSeed.superAdminUserEmail,
      GetSubjectsByProgramBlockE2eSeed.superAdminUserPassword,
    );
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });
  it('should return an array of subjects', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: GetSubjectsByProgramBlockE2eSeed.subjectId,
          name: GetSubjectsByProgramBlockE2eSeed.subjectName,
          code: GetSubjectsByProgramBlockE2eSeed.subjectCode,
        }),
      ]),
    );
  });
  it('should throw a ProgramBlockNotFoundException', async () => {
    const response = await supertest(httpServer)
      .get(wrongPath)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);

    expect(response.body.message).toEqual('sga.program-block.not-found');
  });
  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});