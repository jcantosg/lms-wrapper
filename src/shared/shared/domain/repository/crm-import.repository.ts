import { CRMImport } from '#shared/domain/entity/crm-import.entity';

export abstract class CRMImportRepository {
  abstract save(crmImport: CRMImport): Promise<void>;
  abstract get(id: string): Promise<CRMImport | null>;
  abstract getByFileName(fileName: string): Promise<CRMImport | null>;
}
