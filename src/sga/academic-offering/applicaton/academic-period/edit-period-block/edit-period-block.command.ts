import { Command } from '#shared/domain/bus/command';

export class EditPeriodBlockCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly startDate: Date,
    public readonly adminUsersBusinessUnits: string[],
    public readonly isSuperAdmin: boolean,
  ) {}
}
