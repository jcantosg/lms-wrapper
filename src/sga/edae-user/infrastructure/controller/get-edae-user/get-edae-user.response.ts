import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { IdentityDocument } from '#/sga/shared/domain/value-object/identity-document';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';

export interface EdaeUserResponse {
  id: string;
  name: string;
  surname1: string;
  surname2: string | null;
  email: string;
  identityDocument: IdentityDocument;
  roles: EdaeRoles[];
  businessUnits: EdaeUserBusinessUnitResponse[];
  timeZone: TimeZoneEnum;
  isRemote: boolean;
  location: EdaeUserLocationResponse;
  avatar: string | null;
  createdAt: Date;
}

export interface EdaeUserBusinessUnitResponse {
  id: string;
  name: string;
}

export interface EdaeUserLocationResponse {
  id: string;
  name: string;
  emoji: string;
}

export class GetEdaeUserResponse {
  static create(edaeUser: EdaeUser): EdaeUserResponse {
    return {
      id: edaeUser.id,
      name: edaeUser.name,
      surname1: edaeUser.surname1,
      surname2: edaeUser.surname2,
      email: edaeUser.email,
      identityDocument: edaeUser.identityDocument,
      roles: edaeUser.roles,
      businessUnits: edaeUser.businessUnits.map(
        (businessUnit: BusinessUnit): EdaeUserBusinessUnitResponse => {
          return {
            id: businessUnit.id,
            name: businessUnit.name,
          };
        },
      ),
      timeZone: edaeUser.timeZone,
      isRemote: edaeUser.isRemote,
      location: {
        id: edaeUser.location.id,
        name: edaeUser.location.name,
        emoji: edaeUser.location.emoji,
      },
      avatar: edaeUser.avatar,
      createdAt: edaeUser.createdAt,
    };
  }
}
