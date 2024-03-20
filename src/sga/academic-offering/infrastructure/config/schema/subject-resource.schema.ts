import { EntitySchema } from 'typeorm';
import { SubjectResource } from '#academic-offering/domain/entity/subject-resource.entity';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';

export const subjectResourceSchema = new EntitySchema<SubjectResource>({
  name: 'SubjectResource',
  tableName: 'subject_resources',
  target: SubjectResource,
  columns: {
    ...BaseSchemaColumns,
    name: {
      type: String,
      nullable: false,
    },
    url: {
      type: String,
      nullable: false,
    },
    size: {
      type: Number,
      nullable: false,
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
  },
});
