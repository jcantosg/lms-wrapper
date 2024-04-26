import { EditStudentE2eSeed } from '#test/e2e/student/edit-student.e2e-seeds';
import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { Student } from '#/student/domain/entity/student.entity';

const path = `/student/${EditStudentE2eSeed.existingStudentId}`;

describe('/student/:id (PUT)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new EditStudentE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      EditStudentE2eSeed.superAdminUserEmail,
      EditStudentE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      EditStudentE2eSeed.adminUserEmail,
      EditStudentE2eSeed.adminUserPassword,
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
  it('should edit a student', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        name: 'Juan',
        surname: 'Ros',
        surname2: 'Pérez',
        email: 'juan@test.org',
        universaeEmail: 'juanros@universae.com',
        isActive: true,
      })
      .expect(200);
    const repository = datasource.getRepository(Student);
    const student = await repository.findOne({
      where: { id: EditStudentE2eSeed.existingStudentId },
    });
    expect(student?.name).toEqual('Juan');
  });
  it('should throw a StudentDuplicatedEmailException', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        name: 'Juan',
        surname: 'Ros',
        surname2: 'Pérez',
        email: 'samuel@test.org',
        universaeEmail: 'juanros@universae.com',
        isActive: true,
      })
      .expect(409);
    expect(response.body.message).toEqual('sga.student.duplicated-email');
  });

  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
