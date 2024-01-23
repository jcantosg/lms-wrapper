import { EntitySchema } from 'typeorm';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';

export const classroomSchema = new EntitySchema<Classroom>({
  name: 'Classroom',
  tableName: 'classrooms',
  target: Classroom,
  columns: {
    ...BaseSchemaColumns,
    name: {
      type: String,
      nullable: false,
    },
    code: {
      type: String,
      nullable: false,
      unique: true,
    },
    capacity: {
      type: Number,
      nullable: false,
    },
    isActive: {
      name: 'is_active',
      type: Boolean,
      nullable: false,
      default: true,
    },
  },
  relations: {
    ...BaseSchemaRelations,
    examinationCenter: {
      type: 'many-to-one',
      target: 'ExaminationCenter',
      joinColumn: {
        name: 'examination_center_id',
      },
    },
  },
});
