import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class CreateInternalGroupsBatchCommand implements Command {
  constructor(
    public readonly academicPeriodId: string,
    public readonly prefix: string | null,
    public readonly sufix: string | null,
    public readonly academicPrograms: string[],
    public readonly isDefault: boolean,
    public readonly adminUser: AdminUser,
  ) {}
}
