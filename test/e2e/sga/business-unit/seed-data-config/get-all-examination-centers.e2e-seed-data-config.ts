import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { v4 as uuid } from 'uuid';

export class GetAllExaminationCentersE2eSeedDataConfig {
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

  static businessUnit = {
    id: uuid(),
    name: 'Valencia',
    code: 'XAR',
  };

  static examinationCenters = [
    {
      id: uuid(),
      name: 'exCenter_1',
      code: 'EX01',
      address: 'test address',
    },
    {
      id: uuid(),
      name: 'exCenter_2',
      code: 'EX02',
      address: 'test address 2',
    },
  ];
}
