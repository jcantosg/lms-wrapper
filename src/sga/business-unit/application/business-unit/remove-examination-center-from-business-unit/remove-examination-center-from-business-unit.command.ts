import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Command } from '#shared/domain/bus/command';

export class RemoveExaminationCentersFromBusinessUnitCommand
  implements Command
{
  constructor(
    public readonly id: string,
    public readonly user: AdminUser,
    public readonly examinationCenter: string,
  ) {}
}
