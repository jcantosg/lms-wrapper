import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Command } from '#shared/domain/bus/command';
import { IdentityDocumentValues } from '#/sga/shared/domain/value-object/identity-document';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class RegisterAdminUserCommand implements Command {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly roles: AdminUserRoles[],
    readonly name: string,
    readonly businessUnits: string[],
    readonly surname: string,
    readonly identityDocument: IdentityDocumentValues,
    readonly surname2: string | null,
    readonly user: AdminUser,
    readonly avatar?: string,
  ) {}
}
