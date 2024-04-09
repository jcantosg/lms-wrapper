import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Command } from '#shared/domain/bus/command';

export class EditTitleCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly officialCode: string | null,
    public readonly officialTitle: string,
    public readonly officialProgram: string,
    public readonly businessUnitId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
