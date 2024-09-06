import { EntitySchema } from 'typeorm';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';

export const academicRecordSchema = new EntitySchema<AcademicRecord>({
  name: 'AcademicRecord',
  tableName: 'academic_records',
  target: AcademicRecord,
  columns: {
    ...BaseSchemaColumns,
    modality: {
      type: 'enum',
      enum: AcademicRecordModalityEnum,
      nullable: false,
    },
    isModular: {
      type: 'boolean',
      nullable: false,
    },
    status: {
      type: 'enum',
      enum: AcademicRecordStatusEnum,
      nullable: false,
    },
    leadId: {
      name: 'lead_id',
      type: String,
      nullable: true,
    },
  },
  relations: {
    ...BaseSchemaRelations,
    student: {
      type: 'many-to-one',
      target: 'Student',
      joinColumn: {
        name: 'student_id',
      },
    },
    businessUnit: {
      type: 'many-to-one',
      target: 'BusinessUnit',
      joinColumn: {
        name: 'business_unit_id',
      },
    },
    virtualCampus: {
      type: 'many-to-one',
      target: 'VirtualCampus',
      joinColumn: {
        name: 'virtual_campus_id',
      },
    },
    academicPeriod: {
      type: 'many-to-one',
      target: 'AcademicPeriod',
      joinColumn: {
        name: 'academic_period_id',
      },
    },
    initialAcademicPeriod: {
      type: 'many-to-one',
      target: 'AcademicPeriod',
      joinColumn: {
        name: 'initial_academic_period_id',
      },
    },
    academicProgram: {
      type: 'many-to-one',
      target: 'AcademicProgram',
      joinColumn: {
        name: 'academic_program_id',
      },
    },
  },
});
