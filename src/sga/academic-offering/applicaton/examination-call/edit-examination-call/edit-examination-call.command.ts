import { Command } from '#shared/domain/bus/command';

export class EditExaminationCallCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly adminUserBusinessUnits: string[],
    public readonly isSuperAdmin: boolean,
  ) {}
}
