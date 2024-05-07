import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { PeriodBlockBody } from '#academic-offering/infrastructure/controller/academic-period/create-academic-period.controller';

export class CreateAcademicPeriodCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly code: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly businessUnit: string,
    public readonly adminUsersBusinessUnits: string[],
    public readonly adminUser: AdminUser,
    public readonly periodBlocks: PeriodBlockBody[],
  ) {}
}
