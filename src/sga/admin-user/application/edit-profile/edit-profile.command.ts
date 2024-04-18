import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class EditProfileCommand implements Command {
  constructor(
    public readonly adminUser: AdminUser,
    public readonly name: string,
    public readonly surname: string,
    public readonly surname2: string | null | undefined,
    public readonly avatar: string | null | undefined,
  ) {}
}
