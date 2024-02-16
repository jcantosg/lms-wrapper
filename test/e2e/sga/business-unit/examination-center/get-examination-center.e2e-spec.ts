import { startApp } from '#test/e2e/e2e-helper';
import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import datasource from '#config/ormconfig';
import supertest from 'supertest';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { GetExaminationCenterE2eSeed } from '#test/e2e/sga/business-unit/examination-center/get-examination-center.e2e-seeds';

const path = `/examination-center/${GetExaminationCenterE2eSeed.examinationCenterId}`;
const wrongPath = '/examination-center/5eebfc83-21f4-4234-bd0d-859875493e26';

describe('/examination-center (GET)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new GetExaminationCenterE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      GetExaminationCenterE2eSeed.superAdminUserEmail,
      GetExaminationCenterE2eSeed.superAdminUserPassword,
    );
  });

  it('should throw unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return an examination center', async () => {
    const newExaminationCenter = await supertest(httpServer)
      .get(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(200);

    expect(newExaminationCenter.body).toMatchObject(
      expect.objectContaining({
        id: GetExaminationCenterE2eSeed.examinationCenterId,
        name: GetExaminationCenterE2eSeed.examinationCenterName,
        code: GetExaminationCenterE2eSeed.examinationCenterCode,
        businessUnits: [],
        address: GetExaminationCenterE2eSeed.examinationCenterAddress,
        isActive: true,
        classrooms: [
          {
            id: GetExaminationCenterE2eSeed.classroomId,
            code: GetExaminationCenterE2eSeed.classroomCode,
            name: GetExaminationCenterE2eSeed.classroomName,
            capacity: GetExaminationCenterE2eSeed.classroomCapacity,
          },
        ],
      }),
    );
  });
  it('should return a 404 response', async () => {
    await supertest(httpServer)
      .get(wrongPath)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .expect(404);
  });

  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
