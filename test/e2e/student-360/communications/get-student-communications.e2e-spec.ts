import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { loginStudent } from '#test/e2e/sga/e2e-auth-helper';
import { GetStudentCommunicationsE2eSeed } from '#test/e2e/student-360/communications/get-student-communications.e2e-seed';

const path = `/student-360/communications`;

describe('/student-360/communications (GET)', () => {
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
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return all student communications', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(studentToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toEqual([
      {
        id: GetStudentCommunicationsE2eSeed.communicationId,
        message: {
          body: GetStudentCommunicationsE2eSeed.communicationBody,
          subject: GetStudentCommunicationsE2eSeed.communicationSubject,
          shortDescription:
            GetStudentCommunicationsE2eSeed.communicationShortDescription,
        },
        sentAt: expect.any(String),
        isRead: false,
        sentBy: {
          id: GetStudentCommunicationsE2eSeed.superAdminUserId,
          name: expect.any(String),
          surname: expect.any(String),
          surname2: expect.any(String),
          avatar: expect.any(String),
        },
      },
    ]);
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
