import { EntitySchema } from 'typeorm';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';

export const programBlockSchema = new EntitySchema<ProgramBlock>({
  name: 'ProgramBlock',
  tableName: 'program_blocks',
  target: ProgramBlock,
  columns: {
    ...BaseSchemaColumns,
    name: {
      type: String,
      nullable: false,
    },
  },
  relations: {
    ...BaseSchemaRelations,
    academicProgram: {
      type: 'many-to-one',
      target: 'AcademicProgram',
      joinColumn: {
        name: 'academic_program_id',
      },
    },
    subjects: {
      type: 'many-to-many',
      target: 'Subject',
      joinTable: {
        name: 'program_block_subjects',
        joinColumn: {
          name: 'program_block_id',
        },
        inverseJoinColumn: {
          name: 'subject_id',
        },
      },
    },
    blockRelation: {
      type: 'one-to-one',
      target: 'BlockRelation',
      inverseSide: 'programBlock',
    },
  },
});
