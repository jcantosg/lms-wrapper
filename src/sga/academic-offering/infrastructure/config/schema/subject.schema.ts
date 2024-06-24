import { EntitySchema } from 'typeorm';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { ValueObjectTransformer } from '#shared/infrastructure/value-object/value-object-transformer';
import { LmsCourse } from '#/lms-wrapper/domain/entity/lms-course';

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
      nullable: true,
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
    officialRegionalCode: {
      name: 'official_regional_code',
      type: String,
      nullable: true,
    },
    lmsCourse: {
      name: 'lms_course',
      type: 'json',
      nullable: true,
      transformer: ValueObjectTransformer(LmsCourse),
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
    defaultTeacher: {
      type: 'many-to-one',
      target: 'EdaeUser',
      joinColumn: {
        name: 'default_teacher_id',
      },
    },
    programBlocks: {
      type: 'many-to-many',
      target: 'ProgramBlock',
      joinTable: {
        name: 'program_block_subjects',
        joinColumn: {
          name: 'subject_id',
        },
        inverseJoinColumn: {
          name: 'program_block_id',
        },
      },
    },
    enrollments: {
      type: 'one-to-many',
      target: 'Enrollment',
      inverseSide: 'subject',
    },
  },
});
