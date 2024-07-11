import { CommandHandler } from '#shared/domain/bus/command.handler';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import { EditChatroomCommand } from '#student-360/chat/application/edit-chatroom/edit-chatroom.command';
import { ChatroomNotFoundException } from '#shared/domain/exception/chat/chatroom.not-found.exception';

export class EditChatroomHandler implements CommandHandler {
  constructor(private readonly chatroomRepository: ChatroomRepository) {}

  async handle(command: EditChatroomCommand): Promise<void> {
    const chatroom = await this.chatroomRepository.get(command.id);

    if (!chatroom) {
      throw new ChatroomNotFoundException();
    }

    chatroom.update(command.chatroomId);
    await this.chatroomRepository.save(chatroom);
  }
}
