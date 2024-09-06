import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class ChatroomNotFoundException extends NotFoundException {
  constructor() {
    super('student-360.chatroom.not-found');
  }
}
