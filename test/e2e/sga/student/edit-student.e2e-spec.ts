import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { EditStudentE2eSeed } from '#test/e2e/sga/student/edit-student.e2e-seeds';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { login } from '#test/e2e/sga/e2e-auth-helper';
import { studentSchema } from '#shared/infrastructure/config/schema/student.schema';

const path = `/student/${EditStudentE2eSeed.existingStudentId}`;

describe('/student/:id (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new EditStudentE2eSeed(datasource);
    await seeder.arrange();
    [superAdminAccessToken, adminAccessToken] = await Promise.all([
      login(
        httpServer,
        EditStudentE2eSeed.superAdminUserEmail,
        EditStudentE2eSeed.superAdminUserPassword,
      ),
      login(
        httpServer,
        EditStudentE2eSeed.adminUserEmail,
        EditStudentE2eSeed.adminUserPassword,
      ),
    ]);
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
    const repository = datasource.getRepository(studentSchema);
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
  });
});
