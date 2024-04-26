import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class CreateStudentCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly surname: string,
    public readonly surname2: string,
    public readonly email: string,
    public readonly universaeEmail: string,
    public readonly adminUser: AdminUser,
  ) {}
}
