import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { loginTeacher } from '#test/e2e/sga/e2e-auth-helper';
import { ChatsE2eSeed } from '#test/e2e/student-360/chat/chats.e2e-seed';

const path = '/edae-360/student-chat';

describe('eda-360/student-chat (GET)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let studentToken: string;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new ChatsE2eSeed(datasource);
    await seeder.arrange();
    studentToken = await loginTeacher(
      httpServer,
      ChatsE2eSeed.edaeUserEmail,
      ChatsE2eSeed.edaeUserPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).get(path).expect(401);
  });

  it('should throw 400 error if query params required are not provided', async () => {
    await supertest(httpServer)
      .get(path)
      .query({
        academicPeriodId: 'ed2fba69-d710-4ca0-a977-efbbba18441e',
      })
      .auth(studentToken, { type: 'bearer' })
      .expect(400);
  });

  it('should throw 400 error if all query params required are not provided', async () => {
    await supertest(httpServer)
      .get(path)
      .query({
        academicPeriodId: 'ed2fba69-d710-4ca0-a977-efbbba18441e',
        titleId: 'ed2fba69-d710-4ca0-a977-efbbba18441e',
        subjectId: 'ed2fba69-d710-4ca0-a977-efbbba18441e',
      })
      .auth(studentToken, { type: 'bearer' })
      .expect(400);
  });

  it('should return all student teacher chats', async () => {
    const response = await supertest(httpServer)
      .get(path)
      .query({
        businessUnitId: ChatsE2eSeed.businessUnitId,
        academicPeriodId: ChatsE2eSeed.academicPeriodId,
        titleId: ChatsE2eSeed.titleId,
        subjectId: ChatsE2eSeed.subjectId,
      })
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
