import { Command } from '#shared/domain/bus/command';

export class EditAcademicPeriodCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly code: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly adminUsersBusinessUnits: string[],
    public readonly isSuperAdmin: boolean,
  ) {}
}
