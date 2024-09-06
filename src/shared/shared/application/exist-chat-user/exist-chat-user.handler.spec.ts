import { ExistChatUserHandler } from '#shared/application/exist-chat-user/exist-chat-user.handler';
import { ChatRepository } from '#shared/domain/repository/chat-repository';
import { ExistChatUserQuery } from '#shared/application/exist-chat-user/exist-chat-user.query';
import { ChatMockRepository } from '#test/mocks/shared/chat-mock-repository';

let handler: ExistChatUserHandler;
let repository: ChatRepository;
let existUserByEmailSpy: jest.SpyInstance;

const query = new ExistChatUserQuery('email@email.org');

describe('Exist Chat User Handler Test', () => {
  beforeAll(() => {
    repository = new ChatMockRepository();
    handler = new ExistChatUserHandler(repository);
    existUserByEmailSpy = jest.spyOn(repository, 'existUserByEmail');
  });

  it('should call to method repository', async () => {
    await handler.handle(query);
    expect(existUserByEmailSpy).toHaveBeenCalledTimes(1);
    expect(existUserByEmailSpy).toHaveBeenCalledWith(query.email);
  });
});
