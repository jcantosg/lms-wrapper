import { CommandHandler } from '#shared/domain/bus/command.handler';
import { CreateChatUserCommand } from '#shared/application/create-chat-user/create-chat-user.command';
import { ChatRepository } from '#shared/domain/repository/chat-repository';

export class CreateChatUserHandler implements CommandHandler {
  constructor(private readonly chatRepository: ChatRepository) {}

  async handle(command: CreateChatUserCommand): Promise<void> {
    await this.chatRepository.createUser(
      command.id,
      command.email,
      command.password,
      command.displayName,
    );
  }
}
