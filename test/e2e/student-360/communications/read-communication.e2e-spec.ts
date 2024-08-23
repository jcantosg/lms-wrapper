import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { loginStudent } from '#test/e2e/sga/e2e-auth-helper';
import { GetStudentCommunicationsE2eSeed } from '#test/e2e/student-360/communications/get-student-communications.e2e-seed';
import { CommunicationStudentSchema } from '#shared/infrastructure/config/schema/communication-student.schema';
import { CommunicationStudentPostgresRepository } from '#shared/infrastructure/repository/communication-student.postgres-repository';

const path = `/student-360/communications/${GetStudentCommunicationsE2eSeed.communicationId}`;

describe('/student-360/communications/{{id}} (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let studentToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new GetStudentCommunicationsE2eSeed(datasource);
    await seeder.arrange();
    studentToken = await loginStudent(
      httpServer,
      GetStudentCommunicationsE2eSeed.studentUniversaeEmail,
      GetStudentCommunicationsE2eSeed.studentPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });

  it('should read communication', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(studentToken, { type: 'bearer' })
      .expect(200);

    const communicationStudentRepository =
      new CommunicationStudentPostgresRepository(
        datasource.getRepository(CommunicationStudentSchema),
      );

    const communication =
      await communicationStudentRepository.getByCommunicationAndStudent(
        GetStudentCommunicationsE2eSeed.communicationId,
        GetStudentCommunicationsE2eSeed.studentId,
      );

    expect(communication!.isRead).toBe(true);
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
