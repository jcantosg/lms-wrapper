import { Command } from '#shared/domain/bus/command';
import { IdentityDocumentValues } from '#/sga/shared/domain/value-object/identity-document';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class EditEdaeUserCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly surname1: string,
    public readonly identityDocument: IdentityDocumentValues,
    public readonly roles: EdaeRoles[],
    public readonly timeZone: TimeZoneEnum,
    public readonly isRemote: boolean,
    public readonly location: string,
    public readonly surname2: string | null,
    public readonly avatar: string | null,
    public readonly adminUser: AdminUser,
  ) {}
}
