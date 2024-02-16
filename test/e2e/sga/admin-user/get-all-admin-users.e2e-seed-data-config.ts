import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import {
  IdentityDocument,
  IdentityDocumentType,
} from '#/sga/shared/domain/value-object/identity-document';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { v4 as uuid } from 'uuid';

export class GetAllAdminUsersE2eSeedDataConfig {
  static country = Country.create(
    uuid(),
    'TESTGET',
    'TESTGET',
    'TestGet',
    '+999',
    '🏳️Get',
  );

  static adminUsers = [
    AdminUser.create(
      uuid(),
      'roma@oliveira.com',
      '1234',
      [AdminUserRoles.SUPERADMIN],
      'Romario',
      '',
      [],
      'Oliveira',
      '',
      new IdentityDocument({
        identityDocumentType: IdentityDocumentType.DNI,
        identityDocumentNumber: '57869126E',
      }),
    ),
    AdminUser.create(
      uuid(),
      'pepe@perez.com',
      '1234',
      [AdminUserRoles.GESTOR_360],
      'Pepe',
      '',
      [],
      'Perez',
      '',
      new IdentityDocument({
        identityDocumentType: IdentityDocumentType.DNI,
        identityDocumentNumber: '13856076W',
      }),
    ),
  ];

  static businessUnits = [
    BusinessUnit.create(
      uuid(),
      'Valencia',
      'XAR',
      GetAllAdminUsersE2eSeedDataConfig.country,
      GetAllAdminUsersE2eSeedDataConfig.adminUsers[0],
    ),
    BusinessUnit.create(
      uuid(),
      'Alicante',
      'ALC',
      GetAllAdminUsersE2eSeedDataConfig.country,
      GetAllAdminUsersE2eSeedDataConfig.adminUsers[0],
    ),
    BusinessUnit.create(
      uuid(),
      'Sevilla',
      'SEV',
      GetAllAdminUsersE2eSeedDataConfig.country,
      GetAllAdminUsersE2eSeedDataConfig.adminUsers[0],
    ),
  ];
}
