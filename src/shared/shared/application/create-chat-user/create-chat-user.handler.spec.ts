import { CreateChatUserHandler } from '#shared/application/create-chat-user/create-chat-user.handler';
import { ChatRepository } from '#shared/domain/repository/chat-repository';
import { CreateChatUserCommand } from '#shared/application/create-chat-user/create-chat-user.command';
import { ChatMockRepository } from '#test/mocks/shared/chat-mock-repository';

let handler: CreateChatUserHandler;
let repository: ChatRepository;
let createChatUserSpy: jest.SpyInstance;

const command = new CreateChatUserCommand(
  'id',
  'email@email.com',
  'password',
  'displayName',
);

describe('Create Chat User Handler Test', () => {
  beforeAll(() => {
    repository = new ChatMockRepository();
    handler = new CreateChatUserHandler(repository);
    createChatUserSpy = jest.spyOn(repository, 'createUser');
  });

  it('should create a chat user', async () => {
    await handler.handle(command);
    expect(createChatUserSpy).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
