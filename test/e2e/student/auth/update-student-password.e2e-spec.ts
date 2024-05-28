import { HttpServer, INestApplication } from '@nestjs/common';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';
import supertest from 'supertest';
import { UpdateStudentPasswordE2eSeed } from '#test/e2e/student/auth/update-student-password.e2e-seeds';
import { StudentRecoveryPasswordTokenPostgresRepository } from '#/student/student/infrastructure/repository/student-recovery-password-token.postgres-repository';
import { StudentRecoveryPasswordToken } from '#/student/student/domain/entity/student-recovery-password-token.entity';
import { StudentPostgresRepository } from '#/student/student/infrastructure/repository/student.postgres-repository';
import { Student } from '#shared/domain/entity/student.entity';

const path = '/student/auth/update-password';

describe('/student/auth/update-password (PUT)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let seeder: E2eSeed;

  beforeAll(async () => {
    app = await startApp();
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
      datasource.getRepository(StudentRecoveryPasswordToken),
    );
    const studentRepository = new StudentPostgresRepository(
      datasource.getRepository(Student),
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
    await app.close();
    await datasource.destroy();
  });
});
