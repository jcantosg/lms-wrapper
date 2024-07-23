import { HttpServer } from '@nestjs/common';
import supertest from 'supertest';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { EditChatroomSeed } from '#test/e2e/student-360/chat/edit-chatroom.e2e-seed';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import { loginTeacher } from '#test/e2e/sga/e2e-auth-helper';
import { ChatroomPostgresRepository } from '#shared/infrastructure/repository/chatroom.postgres-repository';
import { chatroomSchema } from '#shared/infrastructure/config/schema/chatroom.schema';

const path = `/edae-360/chatroom/${EditChatroomSeed.chatroomId}`;

describe('/student-360/chatroom/:id (PUT)', () => {
  let httpServer: HttpServer;
  let seeder: E2eSeed;
  let edaeToken: string;
  let chatroomRepository: ChatroomRepository;

  beforeAll(async () => {
    httpServer = app.getHttpServer();
    seeder = new EditChatroomSeed(datasource);
    await seeder.arrange();
    edaeToken = await loginTeacher(
      httpServer,
      EditChatroomSeed.edaeUserEmail,
      EditChatroomSeed.edaeUserPassword,
    );
  });

  it('should return unauthorized', async () => {
    await supertest(httpServer).put(path).expect(401);
  });

  it('should throw bad request', async () => {
    await supertest(httpServer)
      .put(path)
      .auth(edaeToken, { type: 'bearer' })
      .send({})
      .expect(400);
  });

  it('should return a 404 chatroom not found', async () => {
    const response = await supertest(httpServer)
      .put('/edae-360/chatroom/63e9649a-5b20-4476-b8b6-4bd2357f05c8')
      .auth(edaeToken, { type: 'bearer' })
      .send({
        chatroomId: EditChatroomSeed.chatroomId,
      })
      .expect(404);

    expect(response.body.message).toEqual('student-360.chatroom.not-found');
  });

  it('should edit the chatroom', async () => {
    chatroomRepository = new ChatroomPostgresRepository(
      datasource.getRepository(chatroomSchema),
    );

    await supertest(httpServer)
      .put(path)
      .auth(edaeToken, { type: 'bearer' })
      .send({
        chatroomId: EditChatroomSeed.chatroomIdFb,
      })
      .expect(200);

    const chatroom = await chatroomRepository.get(EditChatroomSeed.chatroomId);

    expect(chatroom?.chatroomId).toEqual(EditChatroomSeed.chatroomIdFb);
  });

  afterAll(async () => {
    await seeder.clear();
  });
});
