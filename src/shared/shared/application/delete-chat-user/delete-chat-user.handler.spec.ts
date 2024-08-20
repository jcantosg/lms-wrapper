import { ChatRepository } from '#shared/domain/repository/chat-repository';
import { ChatMockRepository } from '#test/mocks/shared/chat-mock-repository';
import { DeleteChatUserHandler } from '#shared/application/delete-chat-user/delete-chat-user.handler';
import { DeleteChatUserCommand } from '#shared/application/delete-chat-user/delete-chat-user.command';

let handler: DeleteChatUserHandler;
let repository: ChatRepository;
let deleteChatUserSpy: jest.SpyInstance;

const command = new DeleteChatUserCommand('id');

describe('Create Chat User Handler Test', () => {
  beforeAll(() => {
    repository = new ChatMockRepository();
    handler = new DeleteChatUserHandler(repository);
    deleteChatUserSpy = jest.spyOn(repository, 'deleteUser');
  });

  it('should create a chat user', async () => {
    await handler.handle(command);
    expect(deleteChatUserSpy).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
