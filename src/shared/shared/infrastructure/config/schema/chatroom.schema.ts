import { EntitySchema } from 'typeorm';
import { Chatroom } from '#shared/domain/entity/chatroom.entity';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';

export const chatroomSchema = new EntitySchema<Chatroom>({
  name: 'Chatroom',
  target: Chatroom,
  tableName: 'chatrooms',
  columns: {
    ...BaseSchemaColumns,
    chatroomId: {
      name: 'chatroom_id',
      type: String,
      nullable: true,
    },
  },
  relations: {
    ...BaseSchemaRelations,
    student: {
      type: 'many-to-one',
      target: 'Student',
      joinColumn: {
        name: 'student_id',
      },
    },
    teacher: {
      type: 'many-to-one',
      target: 'EdaeUser',
      joinColumn: {
        name: 'teacher_id',
      },
    },
    internalGroup: {
      type: 'many-to-one',
      target: 'InternalGroup',
      joinColumn: {
        name: 'internal_group_id',
      },
    },
  },
});
