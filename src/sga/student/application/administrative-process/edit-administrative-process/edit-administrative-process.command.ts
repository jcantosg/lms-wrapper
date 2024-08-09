import { Command } from '#shared/domain/bus/command';
import { AdministrativeProcessStatusEnum } from '#student/domain/enum/administrative-process-status.enum';

export class EditAdministrativeProcessCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly status: AdministrativeProcessStatusEnum,
  ) {}
}
