import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { IdentityDocumentValues } from '#/sga/shared/domain/value-object/identity-document';

export class EditAdminUserCommand implements Command {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly surname: string,
    readonly surname2: string | null,
    readonly identityDocument: IdentityDocumentValues,
    readonly roles: AdminUserRoles[],
    readonly user: AdminUser,
    readonly avatar?: string,
  ) {}
}
