import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import { IdentityDocumentValues } from '#/sga/shared/domain/value-object/identity-document';
import { Command } from '#shared/domain/bus/command';

export class CreateEdaeUserCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly surname1: string,
    public readonly surname2: string | null,
    public readonly email: string,
    public readonly identityDocument: IdentityDocumentValues,
    public readonly roles: EdaeRoles[],
    public readonly businessUnits: string[],
    public readonly adminUserBusinessUnits: string[],
    public readonly timeZone: TimeZoneEnum,
    public readonly isRemote: boolean,
    public readonly location: string,
    public readonly avatar: string | null,
  ) {}
}
