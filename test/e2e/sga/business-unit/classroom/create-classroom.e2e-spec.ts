import { HttpServer, INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { CreateClassroomE2eSeed } from '#test/e2e/sga/business-unit/classroom/create-classroom.e2e-seeds';

const path = `/classroom`;

describe('/classroom (POST)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new CreateClassroomE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      CreateClassroomE2eSeed.superAdminUserEmail,
      CreateClassroomE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      CreateClassroomE2eSeed.adminUserEmail,
      CreateClassroomE2eSeed.adminUserPassword,
    );
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).post(path).expect(401);
  });
  it('should return forbidden', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(adminAccessToken, { type: 'bearer' })
      .expect(403);
  });
  it('should create a classroom', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateClassroomE2eSeed.classroomId,
        name: CreateClassroomE2eSeed.classroomName,
        code: CreateClassroomE2eSeed.classroomCode,
        capacity: CreateClassroomE2eSeed.classroomCapacity,
        examinationCenterId: CreateClassroomE2eSeed.examinationCenterId,
      })
      .expect(201);
  });
  it('should return an ExaminationCenterNotFoundException', async () => {
    const result = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateClassroomE2eSeed.secondClassroomId,
        name: CreateClassroomE2eSeed.secondClassroomName,
        code: CreateClassroomE2eSeed.secondClassRoomCode,
        capacity: CreateClassroomE2eSeed.classroomCapacity,
        examinationCenterId: CreateClassroomE2eSeed.missingExaminationCenterId,
      })
      .expect(404);
    expect(result.body).toMatchObject(
      expect.objectContaining({
        message: 'sga.examination-center.not-found',
      }),
    );
  });
  it('should return a ClassroomNameDuplicatedException', async () => {
    const result = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateClassroomE2eSeed.secondClassroomId,
        name: CreateClassroomE2eSeed.classroomName,
        code: CreateClassroomE2eSeed.classroomCode,
        capacity: CreateClassroomE2eSeed.classroomCapacity,
        examinationCenterId: CreateClassroomE2eSeed.examinationCenterId,
      })
      .expect(409);
    expect(result.body).toMatchObject(
      expect.objectContaining({
        message: 'sga.classroom.duplicated-name',
      }),
    );
  });

  it('should return a ClassroomWrongCapacityException', async () => {
    const result = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateClassroomE2eSeed.secondClassroomId,
        name: CreateClassroomE2eSeed.secondClassroomName,
        code: CreateClassroomE2eSeed.secondClassRoomCode,
        capacity: 0,
        examinationCenterId: CreateClassroomE2eSeed.examinationCenterId,
      })
      .expect(409);
    expect(result.body).toMatchObject(
      expect.objectContaining({
        message: 'sga.classroom.wrong-capacity',
      }),
    );
  });

  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
