import { QueryHandler } from '#shared/domain/bus/query.handler';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import { GetUnreadChatsStudentsQuery } from '#/teacher/application/chat/get-unread-chats-students/get-unread-chats-students.query';

export class GetUnreadChatsStudentsHandler implements QueryHandler {
  constructor(private readonly chatroomRepository: ChatroomRepository) {}

  async handle(query: GetUnreadChatsStudentsQuery) {
    return await this.chatroomRepository.getByEdaeUserAndFBIds(
      query.edaeUser,
      query.fbChatrommIds,
    );
  }
}
