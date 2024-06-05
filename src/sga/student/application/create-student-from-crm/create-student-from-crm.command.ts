import { Command } from '#shared/domain/bus/command';
import { CRMImport } from '#shared/domain/entity/crm-import.entity';

export class CreateStudentFromCRMCommand implements Command {
  constructor(public readonly crmImport: CRMImport) {}
}
