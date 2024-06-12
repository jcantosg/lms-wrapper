import { EntitySchema } from 'typeorm';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';
import { AcademicRecordTransfer } from '#student/domain/entity/academic-record-transfer.entity';

export const academicRecordTransferSchema =
  new EntitySchema<AcademicRecordTransfer>({
    name: 'AcademicRecordTransfer',
    tableName: 'academic_record_transfers',
    target: AcademicRecordTransfer,
    columns: {
      ...BaseSchemaColumns,
      comments: {
        type: String,
        nullable: true,
      },
      files: {
        type: String,
        array: true,
      },
    },
    relations: {
      ...BaseSchemaRelations,
      oldAcademicRecord: {
        type: 'many-to-one',
        target: 'AcademicRecord',
        joinColumn: {
          name: 'old_academic_record_id',
        },
      },
      newAcademicRecord: {
        type: 'many-to-one',
        target: 'AcademicRecord',
        joinColumn: {
          name: 'new_academic_record_id',
        },
      },
    },
  });
