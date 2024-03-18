import { EntitySchema } from 'typeorm';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';
import { Title } from '#academic-offering/domain/entity/title.entity';

export const titleSchema = new EntitySchema<Title>({
  name: 'Title',
  tableName: 'titles',
  target: Title,
  columns: {
    ...BaseSchemaColumns,
    name: {
      type: String,
      nullable: false,
    },
    officialCode: {
      type: String,
      nullable: true,
      name: 'official_code',
    },
    officialTitle: {
      type: String,
      nullable: false,
      name: 'official_title',
    },
    officialProgram: {
      type: String,
      nullable: false,
      name: 'official_program',
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
  },
});
