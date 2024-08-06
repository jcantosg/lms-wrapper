import { ChatRepository } from '#shared/domain/repository/chat-repository';

export class ChatMockRepository implements ChatRepository {
  createUser = jest.fn();
  deleteUser = jest.fn();
  existUserByEmail = jest.fn();
}
