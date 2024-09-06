import { EntitySchema } from 'typeorm';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';

export const internalGroupSchema = new EntitySchema<InternalGroup>({
  name: 'InternalGroup',
  tableName: 'internal_groups',
  target: InternalGroup,
  columns: {
    ...BaseSchemaColumns,
    code: {
      type: String,
      nullable: false,
    },
    isDefault: {
      type: 'boolean',
      nullable: false,
      default: true,
    },
  },
  relations: {
    ...BaseSchemaRelations,
    subject: {
      type: 'many-to-one',
      target: 'Subject',
      joinColumn: {
        name: 'subject_id',
      },
    },
    businessUnit: {
      type: 'many-to-one',
      target: 'BusinessUnit',
      joinColumn: {
        name: 'business_unit_id',
      },
    },
    periodBlock: {
      type: 'many-to-one',
      target: 'PeriodBlock',
      joinColumn: {
        name: 'period_block_id',
      },
    },
    academicPeriod: {
      type: 'many-to-one',
      target: 'AcademicPeriod',
      joinColumn: {
        name: 'academic_period_id',
      },
    },
    academicProgram: {
      type: 'many-to-one',
      target: 'AcademicProgram',
      joinColumn: {
        name: 'academic_program_id',
      },
    },
    students: {
      type: 'many-to-many',
      target: 'Student',
      joinTable: {
        name: 'internal_group_students',
        joinColumn: {
          name: 'internal_group_id',
        },
        inverseJoinColumn: {
          name: 'student_id',
        },
      },
    },
    teachers: {
      type: 'many-to-many',
      target: 'EdaeUser',
      joinTable: {
        name: 'internal_groups_edae_users',
        joinColumn: {
          name: 'internal_group_id',
        },
        inverseJoinColumn: {
          name: 'edae_user_id',
        },
      },
    },
    defaultTeacher: {
      type: 'many-to-one',
      target: 'EdaeUser',
      joinColumn: {
        name: 'default_teacher_id',
      },
    },
  },
});
