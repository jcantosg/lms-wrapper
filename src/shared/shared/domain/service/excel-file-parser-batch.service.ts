import { CRMImport } from '#shared/domain/entity/crm-import.entity';
import { File } from '#shared/domain/file-manager/file';
import { ObjectSchema } from 'joi';

export interface CRMImportBatch {
  imports: CRMImport[];
  offset: number;
  limit: number;
  total: number;
}

export abstract class ExcelFileParserBatch {
  abstract parse(
    file: File,
    validationSchema: ObjectSchema,
    offset: number,
    limit: number,
  ): Promise<CRMImportBatch>;
}
