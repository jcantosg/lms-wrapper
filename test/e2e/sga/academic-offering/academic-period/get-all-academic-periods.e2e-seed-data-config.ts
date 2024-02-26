import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { v4 as uuid } from 'uuid';

export class GetAllAcademicPeriodsE2eSeedDataConfig {
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

  static academicPeriods = [
    {
      id: uuid(),
      name: 'period_1',
      code: 'PER01',
      startDate: new Date('2024-02-22'),
      endDate: new Date('2024-08-22'),
      blockNumber: 1,
    },
    {
      id: uuid(),
      name: 'period_2',
      code: 'PER02',
      startDate: new Date('2024-02-22'),
      endDate: new Date('2024-08-22'),
      blockNumber: 3,
    },
  ];
}
