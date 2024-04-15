import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class CreateProgramBlockCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly academicProgramId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
