import { EntitySchema } from 'typeorm';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';

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
  },
});
