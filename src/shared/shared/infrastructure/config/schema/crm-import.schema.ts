import { EntitySchema } from 'typeorm';
import { BaseSchemaColumns } from '#shared/infrastructure/config/schema/base.schema';
import { CRMImport } from '#shared/domain/entity/crm-import.entity';
import { CRMImportStatus } from '#shared/domain/enum/crm-import-status.enum';

export const crmImportSchema = new EntitySchema<CRMImport>({
  name: 'CRMImport',
  target: CRMImport,
  tableName: 'crm_imports',
  columns: {
    ...BaseSchemaColumns,
    status: {
      type: 'enum',
      enum: CRMImportStatus,
      nullable: false,
      default: CRMImportStatus.CREATED,
    },
    contactId: {
      type: String,
      nullable: true,
    },
    leadId: {
      type: String,
      nullable: true,
    },
    data: {
      type: 'json',
      nullable: true,
    },
    fileName: {
      name: 'file_name',
      type: String,
      nullable: false,
      unique: true,
    },
    errorMessage: {
      name: 'error_message',
      type: String,
      nullable: true,
    },
  },
});
