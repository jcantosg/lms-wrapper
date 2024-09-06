import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { loginStudent } from '#test/e2e/sga/e2e-auth-helper';
import { ChatsE2eSeed } from '#test/e2e/student-360/chat/chats.e2e-seed';

const path = `/student-360/teacher-chat`;

describe('/student-360/teacher-chat (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let studentToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new ChatsE2eSeed(datasource);
    await seeder.arrange();
    studentToken = await loginStudent(
      httpServer,
      ChatsE2eSeed.studentUniversaeEmail,
      ChatsE2eSeed.studentPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should return all student teacher chats', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .auth(studentToken, { type: 'bearer' })
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: ChatsE2eSeed.chatroomId,
          chatroomId: null,
          teacher: expect.objectContaining({
            id: ChatsE2eSeed.edaeUserId,
            name: ChatsE2eSeed.edaeUserName,
            surname1: ChatsE2eSeed.edaeUserSurname,
            avatar: null,
          }),
          student: expect.objectContaining({
            id: ChatsE2eSeed.studentId,
            name: ChatsE2eSeed.studentName,
            surname: ChatsE2eSeed.studentSurname,
            avatar: null,
          }),
          subject: expect.objectContaining({
            id: ChatsE2eSeed.subjectId,
            name: ChatsE2eSeed.subjectName,
            code: ChatsE2eSeed.subjectCode,
          }),
          internalGroup: expect.objectContaining({
            id: ChatsE2eSeed.internalGroupId,
          }),
        }),
      ]),
    );
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
