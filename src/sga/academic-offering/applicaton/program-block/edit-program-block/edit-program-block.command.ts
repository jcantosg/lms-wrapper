import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class EditProgramBlockCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly adminUser: AdminUser,
  ) {}
}
