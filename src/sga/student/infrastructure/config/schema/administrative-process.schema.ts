import { EntitySchema } from 'typeorm';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';
import { AdministrativeProcess } from '#student/domain/entity/administrative-process.entity';
import { AdministrativeProcessStatusEnum } from '#student/domain/enum/administrative-process-status.enum';

export const administrativeProcessSchema =
  new EntitySchema<AdministrativeProcess>({
    name: 'AdministrativeProcess',
    tableName: 'administrative_processes',
    target: AdministrativeProcess,
    columns: {
      ...BaseSchemaColumns,
      type: {
        type: 'enum',
        enum: AdministrativeProcessTypeEnum,
        nullable: false,
      },
      status: {
        type: 'enum',
        enum: AdministrativeProcessStatusEnum,
        nullable: false,
      },
    },
    relations: {
      ...BaseSchemaRelations,
      academicRecord: {
        type: 'one-to-one',
        target: 'AcademicRecord',
        joinColumn: {
          name: 'academic_record_id',
        },
      },
      photo: {
        type: 'one-to-one',
        target: 'AdministrativeProcessDocument',
        joinColumn: {
          name: 'photo_id',
        },
      },
      identityDocuments: {
        type: 'one-to-one',
        target: 'AdministrativeProcessDocument',
        joinColumn: {
          name: 'identity_documents_id',
        },
      },
      accessDocuments: {
        type: 'one-to-one',
        target: 'AdministrativeProcessDocument',
        joinColumn: {
          name: 'access_documents_id',
        },
      },
    },
  });
