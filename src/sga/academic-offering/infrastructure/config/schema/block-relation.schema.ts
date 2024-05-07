import { EntitySchema } from 'typeorm';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';
import { BlockRelation } from '#academic-offering/domain/entity/block-relation.entity';

export const blockRelationSchema = new EntitySchema<BlockRelation>({
  name: 'BlockRelation',
  tableName: 'block_relations',
  target: BlockRelation,
  columns: {
    ...BaseSchemaColumns,
  },
  relations: {
    periodBlock: {
      type: 'one-to-one',
      target: 'PeriodBlock',
      joinColumn: {
        name: 'period_block',
      },
    },
    programBlock: {
      type: 'one-to-one',
      target: 'ProgramBlock',
      joinColumn: {
        name: 'program_block',
      },
    },
    ...BaseSchemaRelations,
  },
});
