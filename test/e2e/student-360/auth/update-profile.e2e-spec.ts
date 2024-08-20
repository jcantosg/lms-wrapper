import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { studentSchema } from '#shared/infrastructure/config/schema/student.schema';
import { UpdateProfileE2eSeed } from '#test/e2e/student-360/auth/update-profile.e2e-seeds';
import { loginStudent } from '#test/e2e/sga/e2e-auth-helper';

const path = `/student-360/profile`;

describe('/student/profile(PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let studentToken: string;
  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new UpdateProfileE2eSeed(datasource);
    await seeder.arrange();
    studentToken = await loginStudent(
      httpServer,
      UpdateProfileE2eSeed.existingUniversaeEmail,
      UpdateProfileE2eSeed.existingStudentPassword,
    );
  });
  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });
  it('should return bad request (empty body)', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(studentToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });
  it('should update a profile', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(studentToken, { type: 'bearer' })
      .send({
        name: 'Juan',
        surname: 'Ros',
        surname2: 'Pérez',
        email: 'juan@test.org',
      })
      .expect(200);
    const repository = datasource.getRepository(studentSchema);
    const student = await repository.findOne({
      where: { id: UpdateProfileE2eSeed.existingStudentId },
    });
    expect(student?.name).toEqual('Juan');
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
