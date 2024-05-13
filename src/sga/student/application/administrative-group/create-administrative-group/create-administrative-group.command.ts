import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class CreateAdministrativeGroupCommand implements Command {
  constructor(
    public readonly academicProgramIds: string[],
    public readonly businessUnitId: string,
    public readonly academicPeriodId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
