import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { ExaminationCallRepository } from '#academic-offering/domain/repository/examination-call.repository';
import { ExaminationCallPostgresRepository } from '#academic-offering/infrastructure/repository/examination-call.postgres-repository';
import { examinationCallSchema } from '#academic-offering/infrastructure/config/schema/examination-call.schema';
import { EditExaminationCallE2eSeed } from '#test/e2e/sga/academic-offering/examintaion-call/edit-examination-call.e2e-seeds';

const path = `/examination-call/${EditExaminationCallE2eSeed.examinationCallId}`;
const wrongPath = '/examination-call/e7db2c44-4b29-49c6-9360-74ec885a6e56';

describe('/examination-call/:id (PUT)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  let examinationCallRepository: ExaminationCallRepository;
  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new EditExaminationCallE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      EditExaminationCallE2eSeed.superAdminUserEmail,
      EditExaminationCallE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      EditExaminationCallE2eSeed.adminUserEmail,
      EditExaminationCallE2eSeed.adminUserPassword,
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
  it('should return bad request (empty body)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });
  it('should edit examination call', async () => {
    examinationCallRepository = new ExaminationCallPostgresRepository(
      datasource.getRepository(examinationCallSchema),
    );
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        name: EditExaminationCallE2eSeed.examinationCallNewName,
        startDate: EditExaminationCallE2eSeed.examinationCallNewStartDate,
        endDate: EditExaminationCallE2eSeed.examinationCallNewEndDate,
      })
      .expect(200);

    const examinationCall = await examinationCallRepository.get(
      EditExaminationCallE2eSeed.examinationCallId,
    );

    expect(examinationCall?.name).toBe(
      EditExaminationCallE2eSeed.examinationCallNewName,
    );
    expect(examinationCall?.startDate).toStrictEqual(
      EditExaminationCallE2eSeed.examinationCallNewStartDate,
    );
    expect(examinationCall?.endDate).toStrictEqual(
      EditExaminationCallE2eSeed.examinationCallNewEndDate,
    );
  });

  it('should throw a ExaminationCallNotFoundException', async () => {
    const response = await supertest(httpServer)
      .put(wrongPath)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        name: EditExaminationCallE2eSeed.examinationCallNewName,
        startDate: EditExaminationCallE2eSeed.examinationCallNewStartDate,
        endDate: EditExaminationCallE2eSeed.examinationCallNewEndDate,
      })
      .expect(404);
    expect(response.body.message).toBe('sga.examination-call.not-found');
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
