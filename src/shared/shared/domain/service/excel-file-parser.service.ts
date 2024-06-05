import { CRMImport } from '#shared/domain/entity/crm-import.entity';
import { File } from '#shared/domain/file-manager/file';
import { ObjectSchema } from 'joi';

export abstract class ExcelFileParser {
  abstract parse(
    file: File,
    validationSchema: ObjectSchema,
  ): Promise<CRMImport>;
}
