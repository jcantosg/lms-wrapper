import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';

import { IdentityDocumentType } from '#/sga/shared/domain/value-object/identity-document';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';

export const edaeUsers = [
  {
    id: '7150536f-75ec-4b95-a0a7-9ec54a587cd9',
    name: 'profesor_spain',
    surname1: 'profesor_spain',
    surname2: null,
    email: 'profesor_madrid@universae.com',
    identityDocument: {
      type: IdentityDocumentType.DNI,
      value: '05161198K',
    },
    roles: [EdaeRoles.DOCENTE],
    businessUnits: ['MADRID', 'MURCIA', 'BARCELONA', 'BARCELONA2'],
    timeZone: TimeZoneEnum.GMT_PLUS_2,
    isRemote: false,
    locationIso: 'ES',
    avatar: null,
  },
  {
    id: '9d54906a-677e-4a62-b38f-2cac71066062',
    name: 'profesor_murcia',
    surname1: 'profesor_murcia',
    surname2: null,
    email: 'profesor_murcia@universae.com',
    identityDocument: {
      type: IdentityDocumentType.DNI,
      value: '48396266B',
    },
    roles: [EdaeRoles.DOCENTE],
    businessUnits: ['MURCIA'],
    timeZone: TimeZoneEnum.GMT_PLUS_2,
    isRemote: false,
    locationIso: 'ES',
    avatar: null,
  },
  {
    id: 'ba117021-9258-4795-9833-4902b03b15b5',
    name: 'profesor_colombia',
    surname1: 'profesor_colombia',
    surname2: null,
    email: 'profesor_colombia@universae.com',
    identityDocument: {
      type: IdentityDocumentType.DNI,
      value: '61470978M',
    },
    roles: [EdaeRoles.DOCENTE],
    businessUnits: ['MURCIA'],
    timeZone: TimeZoneEnum.GMT_PLUS_2,
    isRemote: false,
    locationIso: 'CO',
    avatar: null,
  },
  {
    id: '8a56de3d-4ed6-4950-bce7-947392fb6078',
    name: 'tutor_spain',
    surname1: 'tutor_spain',
    surname2: null,
    email: 'tutor_spain@universae.com',
    identityDocument: {
      type: IdentityDocumentType.DNI,
      value: '93643422A',
    },
    roles: [EdaeRoles.TUTOR, EdaeRoles.DOCENTE],
    businessUnits: ['MURCIA', 'BARCELONA', 'BARCELONA2', 'MADRID'],
    timeZone: TimeZoneEnum.GMT_PLUS_2,
    isRemote: false,
    locationIso: 'ES',
    avatar: null,
  },
];
