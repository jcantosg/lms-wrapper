import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { UpdateStudentPasswordE2eSeed } from '#test/e2e/student/auth/update-student-password.e2e-seeds';
import { StudentRecoveryPasswordTokenPostgresRepository } from '#/student/student/infrastructure/repository/student-recovery-password-token.postgres-repository';
import { StudentPostgresRepository } from '#/student/student/infrastructure/repository/student.postgres-repository';
import { studentRecoveryPasswordTokenSchema } from '#/student/student/infrastructure/config/schema/student-recovery-password-token.schema';
import { studentSchema } from '#shared/infrastructure/config/schema/student.schema';

const path = '/student/auth/update-password';

describe('/student/auth/update-password (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new UpdateStudentPasswordE2eSeed(datasource);
    await seeder.arrange();
  });
  it('should throw Bad Request', async () => {
    await supertest(httpServer).put(path).send({}).expect(400);
  });

  it('should throw student recovery token not found exception', async () => {
    const response = await supertest(httpServer)
      .put(path)
      .send({
        newPassword: 'test123',
        token: '123',
      })
      .expect(404);
    expect(response.body.message).toBe(
      'student.student-recovery-password-token.not-found',
    );
  });

  it('should update password', async () => {
    const tokenRepository = new StudentRecoveryPasswordTokenPostgresRepository(
      datasource.getRepository(studentRecoveryPasswordTokenSchema),
    );
    const studentRepository = new StudentPostgresRepository(
      datasource.getRepository(studentSchema),
    );

    await supertest(httpServer)
      .post('/student/recover-password')
      .send({
        universaeEmail: UpdateStudentPasswordE2eSeed.studentUniversaeEmail,
      })
      .expect(201);

    const token = await tokenRepository.getByUser(
      UpdateStudentPasswordE2eSeed.studentId,
    );

    await supertest(httpServer)
      .put(path)
      .send({
        newPassword: 'newPassword123',
        token: token?.token,
      })
      .expect(200);

    const student = await studentRepository.get(
      UpdateStudentPasswordE2eSeed.studentId,
    );

    expect(student?.password).not.toBe(
      UpdateStudentPasswordE2eSeed.studentPassword,
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
