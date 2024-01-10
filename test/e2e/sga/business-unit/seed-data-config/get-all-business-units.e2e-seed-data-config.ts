import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { v4 as uuid } from 'uuid';

export class GetAllBusinessUnitsE2eSeedDataConfig {
  static superAdmin = {
    email: 'superadmin@email.com',
    password: 'pass123',
    userId: uuid(),
    roles: [AdminUserRoles.SUPERADMIN],
  };

  static admin = {
    email: 'admin@email.com',
    password: 'pass123',
    userId: uuid(),
    roles: [],
  };

  static country = {
    id: uuid(),
    name: 'TestGet',
    iso: 'TESTGET',
    iso3: 'TESTGET',
    phoneCode: '+999',
    code: 'TESG',
    emoji: '🏳️Get',
  };

  static businessUnits = [
    {
      id: uuid(),
      name: 'Valencia',
      code: 'VAL',
    },
    {
      id: uuid(),
      name: 'Alicante',
      code: 'ALC',
    },
  ];
}
