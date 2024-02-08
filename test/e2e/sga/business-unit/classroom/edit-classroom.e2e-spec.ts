import { HttpServer, INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { ClassroomRepository } from '#business-unit/domain/repository/classroom.repository';
import { ClassroomPostgresRepository } from '#business-unit/infrastructure/repository/classroom.postgres-repository';
import { classroomSchema } from '#business-unit/infrastructure/config/schema/classroom.schema';
import { EditClassroomE2eSeed } from '#test/e2e/sga/business-unit/classroom/edit-classroom.e2e-seeds';

const path = `/classroom/c2fc03f3-676c-4591-b815-e762d0e54542`;

describe('/classroom/:id (PUT)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let adminAccessToken: string;
  let superAdminAccessToken: string;
  let classroomRepository: ClassroomRepository;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new EditClassroomE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      EditClassroomE2eSeed.superAdminUserEmail,
      EditClassroomE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      EditClassroomE2eSeed.adminUserEmail,
      EditClassroomE2eSeed.adminUserPassword,
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

  it('should return an ClassroomNotFoundException', async () => {
    await supertest(httpServer)
      .put('/classroom/ce3e994a-0bd0-4911-a0ec-48429a709284')
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        name: EditClassroomE2eSeed.classroomName,
        code: EditClassroomE2eSeed.classroomCode,
        capacity: EditClassroomE2eSeed.classroomCapacity,
      })
      .expect(404);
  });

  it('should return a ClassroomNameDuplicatedException', async () => {
    const result = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        name: EditClassroomE2eSeed.secondClassroomName,
        code: EditClassroomE2eSeed.classroomCode,
        capacity: EditClassroomE2eSeed.classroomCapacity,
      })
      .expect(409);

    expect(result.body).toMatchObject(
      expect.objectContaining({
        message: 'sga.classroom.duplicated-name',
      }),
    );
  });

  it('should return a ClassroomCodeDuplicatedException', async () => {
    const result = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        name: EditClassroomE2eSeed.classroomName,
        code: EditClassroomE2eSeed.secondClassRoomCode,
        capacity: EditClassroomE2eSeed.classroomCapacity,
      })
      .expect(409);

    expect(result.body).toMatchObject(
      expect.objectContaining({
        message: 'sga.classroom.duplicated-code',
      }),
    );
  });

  it('should edit the classroom', async () => {
    classroomRepository = new ClassroomPostgresRepository(
      datasource.getRepository(classroomSchema),
    );

    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        name: 'Aula03',
        code: 'CodeAula03',
        capacity: 150,
      })
      .expect(200);

    const classroom = await classroomRepository.get(
      'c2fc03f3-676c-4591-b815-e762d0e54542',
    );

    expect(classroom?.name).toEqual('Aula03');
    expect(classroom?.code).toEqual('CodeAula03');
    expect(classroom?.capacity).toEqual(150);
  });

  afterAll(async () => {
    await seeder.clear();
    await app.close();
    await datasource.destroy();
  });
});
