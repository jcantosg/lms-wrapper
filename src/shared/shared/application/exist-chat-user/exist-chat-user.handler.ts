import { CommandHandler } from '#shared/domain/bus/command.handler';
import { ChatRepository } from '#shared/domain/repository/chat-repository';
import { ExistChatUserQuery } from '#shared/application/exist-chat-user/exist-chat-user.query';

export class ExistChatUserHandler implements CommandHandler {
  constructor(private readonly chatRepository: ChatRepository) {}

  async handle(command: ExistChatUserQuery): Promise<boolean> {
    return await this.chatRepository.existUserByEmail(command.email);
  }
}
