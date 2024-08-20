import { CommandHandler } from '#shared/domain/bus/command.handler';
import { ChatRepository } from '#shared/domain/repository/chat-repository';
import { DeleteChatUserCommand } from '#shared/application/delete-chat-user/delete-chat-user.command';

export class DeleteChatUserHandler implements CommandHandler {
  constructor(private readonly chatRepository: ChatRepository) {}

  async handle(command: DeleteChatUserCommand): Promise<void> {
    await this.chatRepository.deleteUser(command.studentId);
  }
}
