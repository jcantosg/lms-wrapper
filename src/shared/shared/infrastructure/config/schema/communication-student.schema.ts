import { EntitySchema } from 'typeorm';
import { BaseSchemaColumns } from '#shared/infrastructure/config/schema/base.schema';
import { CommunicationStudent } from '#shared/domain/entity/communicarion-student.entity';

export const CommunicationStudentSchema =
  new EntitySchema<CommunicationStudent>({
    name: 'CommunicationStudent',
    target: CommunicationStudent,
    tableName: 'communication_students',
    columns: {
      ...BaseSchemaColumns,
      isRead: {
        type: 'boolean',
        default: false,
        name: 'is_read',
      },
      isDeleted: {
        type: 'boolean',
        default: false,
        name: 'is_deleted',
      },
    },
    relations: {
      communication: {
        type: 'many-to-one',
        target: 'Communication',
        joinColumn: {
          name: 'communication_id',
        },
      },
      student: {
        type: 'many-to-one',
        target: 'Student',
        joinColumn: {
          name: 'student_id',
        },
      },
    },
  });
