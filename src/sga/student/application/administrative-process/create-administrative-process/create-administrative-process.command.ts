import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Command } from '#shared/domain/bus/command';

export class CreateAdministrativeProcessCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly academicRecordId: string | null,
    public readonly studentId: string | null,
    public readonly adminUser: AdminUser,
  ) {}
}
