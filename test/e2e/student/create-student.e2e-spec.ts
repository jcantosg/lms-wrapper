import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import { CreateStudentE2eSeed } from '#test/e2e/student/create-student.e2e-seeds';
import datasource from '#config/ormconfig';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import supertest from 'supertest';
import { v4 as uuid } from 'uuid';

const path = `/student`;

describe('/student (POST)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    app = await startApp();
    httpServer = app.getHttpServer();
    seeder = new CreateStudentE2eSeed(datasource);
    await seeder.arrange();
    superAdminAccessToken = await login(
      httpServer,
      CreateStudentE2eSeed.superAdminUserEmail,
      CreateStudentE2eSeed.superAdminUserPassword,
    );
    adminAccessToken = await login(
      httpServer,
      CreateStudentE2eSeed.adminUserEmail,
      CreateStudentE2eSeed.adminUserPassword,
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
  it('should return bad request (empty body)', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });
  it('should create a student', async () => {
    await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateStudentE2eSeed.studentId,
        name: CreateStudentE2eSeed.studentName,
        surname: CreateStudentE2eSeed.studentSurname,
        surname2: CreateStudentE2eSeed.studentSurname2,
        email: CreateStudentE2eSeed.studentEmail,
        universaeEmail: CreateStudentE2eSeed.studentUniversaeEmail,
      })
      .expect(201);
  });
  it('should throw StudentDuplicatedException', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: CreateStudentE2eSeed.existingStudentId,
        name: CreateStudentE2eSeed.studentName,
        surname: CreateStudentE2eSeed.studentSurname,
        surname2: CreateStudentE2eSeed.studentSurname2,
        email: CreateStudentE2eSeed.studentEmail,
        universaeEmail: CreateStudentE2eSeed.studentUniversaeEmail,
      })
      .expect(409);
    expect(response.body.message).toBe('sga.student.duplicated');
  });
  it('should throw StudentDuplicatedEmailException', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: uuid(),
        name: CreateStudentE2eSeed.studentName,
        surname: CreateStudentE2eSeed.studentSurname,
        surname2: CreateStudentE2eSeed.studentSurname2,
        email: CreateStudentE2eSeed.existingStudentEmail,
        universaeEmail: CreateStudentE2eSeed.studentUniversaeEmail,
      })
      .expect(409);
    expect(response.body.message).toBe('sga.student.duplicated-email');
  });
  it('should throw StudentDuplicatedUniversaeEmailException', async () => {
    const response = await supertest(httpServer)
      .post(path)
      .auth(superAdminAccessToken, { type: 'bearer' })
      .send({
        id: uuid(),
        name: CreateStudentE2eSeed.studentName,
        surname: CreateStudentE2eSeed.studentSurname,
        surname2: CreateStudentE2eSeed.studentSurname2,
        email: 'test@test.org',
        universaeEmail: CreateStudentE2eSeed.existingUniversaeEmail,
      })
      .expect(409);
    expect(response.body.message).toBe(
      'sga.student.duplicated-universae-email',
    );
  });
  afterAll(async () => {
    await seeder.clear();
    await datasource.destroy();
    await app.close();
  });
});
