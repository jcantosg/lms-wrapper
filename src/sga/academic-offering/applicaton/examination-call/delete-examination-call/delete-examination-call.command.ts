import { Command } from '#shared/domain/bus/command';

export class DeleteExaminationCallCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly adminUserBusinessUnits: string[],
    public readonly isSuperAdmin: boolean,
  ) {}
}
