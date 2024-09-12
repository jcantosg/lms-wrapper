import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class UpdateStudentPasswordCommand implements Command {
  constructor(
    public readonly studentId: string,
    public readonly newPassword: string,
    public readonly adminUser: AdminUser,
  ) {}
}
