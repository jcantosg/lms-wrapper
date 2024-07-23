import { EntitySchema } from 'typeorm';
import { BaseSchemaColumns } from '#shared/infrastructure/config/schema/base.schema';
import { AdministrativeProcessDocument } from '#student/domain/entity/administrative-process-document.entity';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';
import { AdministrativeProcessDocumentsStatusEnum } from '#student/domain/enum/administrative-process-documents-status.enum';
import { ValueObjectTransformer } from '#shared/infrastructure/value-object/value-object-transformer';
import { AdministrativeProcessFile } from '#student/domain/entity/administrative-process-file';

export const administrativeProcessDocumentSchema =
  new EntitySchema<AdministrativeProcessDocument>({
    name: 'AdministrativeProcessDocument',
    tableName: 'administrative_process_documents',
    target: AdministrativeProcessDocument,
    columns: {
      ...BaseSchemaColumns,
      type: {
        type: 'enum',
        enum: AdministrativeProcessTypeEnum,
        nullable: false,
      },
      status: {
        type: 'enum',
        enum: AdministrativeProcessDocumentsStatusEnum,
        nullable: false,
      },
      files: {
        name: 'files',
        type: 'simple-array',
        nullable: true,
        transformer: ValueObjectTransformer(AdministrativeProcessFile),
      },
    },
    relations: {
      student: {
        type: 'many-to-one',
        target: 'Student',
        joinColumn: {
          name: 'student_id',
        },
      },
      academicRecord: {
        type: 'many-to-one',
        target: 'AcademicRecord',
        joinColumn: {
          name: 'academic_record_id',
        },
      },
    },
  });
