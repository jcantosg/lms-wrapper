import { EntitySchema } from 'typeorm';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';

export const academicProgramSchema = new EntitySchema<AcademicProgram>({
  name: 'AcademicProgram',
  tableName: 'academic_programs',
  target: AcademicProgram,
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
    structureType: {
      type: 'enum',
      enum: ProgramBlockStructureType,
      nullable: false,
    },
    programBlocksNumber: {
      type: Number,
      name: 'program_blocks_number',
      nullable: false,
      default: 0,
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
    title: {
      type: 'many-to-one',
      target: 'Title',
      joinColumn: {
        name: 'title_id',
      },
    },
    programBlocks: {
      type: 'one-to-many',
      target: 'ProgramBlock',
      inverseSide: 'academicProgram',
    },
    academicPeriods: {
      type: 'many-to-many',
      target: 'AcademicPeriod',
      joinTable: {
        name: 'academic_periods_academic_programs',
        joinColumn: {
          name: 'academic_program_id',
        },
        inverseJoinColumn: {
          name: 'academic_period_id',
        },
      },
    },
    administrativeGroups: {
      type: 'one-to-many',
      target: 'AdministrativeGroup',
      inverseSide: 'academicProgram',
    },
  },
});
