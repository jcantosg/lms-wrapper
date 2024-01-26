import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Command } from '#shared/domain/bus/command';

export class RegisterAdminUserCommand implements Command {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly password: string,
    readonly roles: AdminUserRoles[],
    readonly name: string,
    readonly businessUnits: string[],
    readonly avatar?: string,
  ) {}
}
