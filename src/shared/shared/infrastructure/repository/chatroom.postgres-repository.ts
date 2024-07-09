import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import { chatroomSchema } from '#shared/infrastructure/config/schema/chatroom.schema';
import { Chatroom } from '#shared/domain/entity/chatroom.entity';

@Injectable()
export class ChatroomPostgresRepository implements ChatroomRepository {
  constructor(
    @InjectRepository(chatroomSchema)
    private readonly repository: Repository<Chatroom>,
  ) {}

  async save(chatroom: Chatroom): Promise<void> {
    await this.repository.save({
      id: chatroom.id,
      student: chatroom.student,
      teacher: chatroom.teacher,
      internalGroup: chatroom.internalGroup,
      createdAt: chatroom.createdAt,
      updatedAt: chatroom.updatedAt,
    });
  }

  async saveBatch(chatrooms: Chatroom[]): Promise<void> {
    await this.repository.save(
      chatrooms.map((chatroom) => ({
        id: chatroom.id,
        student: chatroom.student,
        teacher: chatroom.teacher,
        internalGroup: chatroom.internalGroup,
        createdAt: chatroom.createdAt,
        updatedAt: chatroom.updatedAt,
      })),
    );
  }

  async getByStudent(studentId: string): Promise<Chatroom[]> {
    return this.repository.find({
      where: {
        student: {
          id: studentId,
        },
      },
      relations: {
        internalGroup: {
          subject: true,
        },
        teacher: true,
        student: true,
      },
    });
  }

  async existsByStudentAndTeacherAndInternalGroup(
    studentId: string,
    teacherId: string,
    internalGroupId: string,
  ): Promise<boolean> {
    const chatroom = await this.repository.findOne({
      where: {
        student: {
          id: studentId,
        },
        teacher: {
          id: teacherId,
        },
        internalGroup: {
          id: internalGroupId,
        },
      },
    });

    return !!chatroom;
  }
}
