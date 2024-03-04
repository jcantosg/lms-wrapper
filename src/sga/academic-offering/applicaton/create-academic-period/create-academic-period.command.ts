import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';

export interface ExaminationCallValues {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  timezone: TimeZoneEnum;
}

export class CreateAcademicPeriodCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly code: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly businessUnit: string,
    public readonly examinationCalls: ExaminationCallValues[],
    public readonly blocksNumber: number,
    public readonly adminUsersBusinessUnits: string[],
    public readonly adminUser: AdminUser,
  ) {}
}
