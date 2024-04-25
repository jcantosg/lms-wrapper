import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class ChangePasswordCommand implements Command {
  constructor(
    public readonly user: AdminUser,
    public readonly currentPassword: string,
    public readonly newPassword: string,
  ) {}
}
