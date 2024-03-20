import { EntitySchema } from 'typeorm';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';

export const subjectSchema = new EntitySchema<Subject>({
  name: 'Subject',
  tableName: 'subjects',
  target: Subject,
  columns: {
    ...BaseSchemaColumns,
    image: {
      type: String,
      nullable: true,
    },
    name: {
      type: String,
      nullable: false,
    },
    code: {
      type: String,
      nullable: false,
      unique: true,
    },
    officialCode: {
      name: 'official_code',
      type: String,
      nullable: true,
    },
    hours: {
      type: 'int',
      nullable: false,
    },
    modality: {
      type: 'enum',
      enum: SubjectModality,
      nullable: false,
    },
    type: {
      type: 'enum',
      enum: SubjectType,
      nullable: false,
    },
    isRegulated: {
      name: 'is_regulated',
      type: Boolean,
      nullable: false,
      default: true,
    },
    isCore: {
      name: 'is_core',
      type: Boolean,
      nullable: false,
      default: true,
    },
  },
  relations: {
    ...BaseSchemaRelations,
    evaluationType: {
      type: 'many-to-one',
      target: 'EvaluationType',
      joinColumn: {
        name: 'evaluation_type_id',
      },
      nullable: true,
    },
    businessUnit: {
      type: 'many-to-one',
      target: 'BusinessUnit',
      joinColumn: {
        name: 'business_unit_id',
      },
    },
    teachers: {
      type: 'many-to-many',
      target: 'EdaeUser',
      joinTable: {
        name: 'subject_teachers',
        joinColumn: {
          name: 'subject_id',
        },
        inverseJoinColumn: {
          name: 'teacher_id',
        },
      },
    },
    resources: {
      type: 'one-to-many',
      target: 'SubjectResource',
      inverseSide: 'subject',
    },
  },
});
