import { EntitySchema } from 'typeorm';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';

export const administrativeGroupSchema = new EntitySchema<AdministrativeGroup>({
  name: 'AdministrativeGroup',
  tableName: 'administrative_groups',
  target: AdministrativeGroup,
  columns: {
    ...BaseSchemaColumns,
    code: {
      type: String,
      nullable: false,
      unique: true,
    },
  },
  relations: {
    ...BaseSchemaRelations,
    businessUnit: {
      type: 'many-to-one',
      target: 'BusinessUnit',
      joinColumn: {
        name: 'business_unit_id',
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
    programBlock: {
      type: 'many-to-one',
      target: 'ProgramBlock',
      joinColumn: {
        name: 'program_block_id',
      },
    },
    students: {
      type: 'many-to-many',
      target: 'Student',
      joinTable: {
        name: 'administrative_group_students',
        joinColumn: {
          name: 'administrative_group_id',
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
        name: 'administrative_group_teachers',
        joinColumn: {
          name: 'administrative_group_id',
        },
        inverseJoinColumn: {
          name: 'edae_user_id',
        },
      },
    },
  },
});
