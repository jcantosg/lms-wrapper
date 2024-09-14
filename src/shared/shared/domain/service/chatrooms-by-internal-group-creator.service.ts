import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import { InternalGroupNotFoundException } from '#shared/domain/exception/internal-group/internal-group.not-found.exception';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';
import { Chatroom } from '#shared/domain/entity/chatroom.entity';

export class ChatroomsByInternalGroupCreator {
  constructor(
    private readonly internalGroupRepository: InternalGroupRepository,
    private readonly chatroomRepository: ChatroomRepository,
    private readonly uuidGenerator: UUIDGeneratorService,
  ) {}

  async create(internalGroupId: string): Promise<void> {
    const internalGroup =
      await this.internalGroupRepository.get(internalGroupId);
    if (!internalGroup) {
      throw new InternalGroupNotFoundException();
    }

    const students = internalGroup.students;
    const teachers = internalGroup.teachers;

    const chatrooms: Chatroom[] = [];

    for (const teacher of teachers) {
      for (const student of students) {
        const id = this.uuidGenerator.generate();
        chatrooms.push(Chatroom.create(id, internalGroup, student, teacher));
      }
    }

    await this.chatroomRepository.saveBatch(chatrooms);
  }
}
