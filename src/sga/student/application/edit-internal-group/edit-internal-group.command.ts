import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class EditInternalGroupCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly isDefault: boolean,
    public readonly adminUser: AdminUser,
  ) {}
}
