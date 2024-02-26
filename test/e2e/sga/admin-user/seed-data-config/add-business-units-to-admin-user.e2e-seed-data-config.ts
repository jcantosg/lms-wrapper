import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { v4 as uuid } from 'uuid';

export class AddBusinessUnitsToAdminUserE2eSeedDataConfig {
  static superAdmin = {
    userId: '951710ab-4673-4111-80fb-1fa9f11938de',
    email: 'superadmin@email.com',
    password: 'test123',
    roles: [AdminUserRoles.SUPERADMIN],
  };

  static gestor360User = {
    userId: '72c92586-034c-4ee3-b263-57fea19e5804',
    email: 'gestor360@universae.com',
    password: 'test123',
    roles: [AdminUserRoles.GESTOR_360],
  };

  static gestor360MurciaUser = {
    userId: 'f44da2d6-3d54-4391-80a0-a95635a16f5e',
    email: 'gestor360_murcia@universae.com',
    password: 'test123',
    roles: [AdminUserRoles.GESTOR_360],
  };

  static supervisor360User = {
    userId: '2cba7a45-dcd7-49ed-9ebf-b0773d1d8897',
    email: 'supervisor360_spain@universae.com',
    password: 'test123',
    roles: [AdminUserRoles.SUPERVISOR_360],
  };

  static secretariaUser = {
    userId: '3477c6b3-935b-410f-adb3-00a586ff432d',
    email: 'supervisor_secretaria_spain@universae.com',
    password: 'test123',
    roles: [AdminUserRoles.SECRETARIA],
  };

  static businessUnits = [
    {
      id: uuid(),
      name: 'Madrid',
      code: 'MAD',
    },
    {
      id: uuid(),
      name: 'BARCELONA',
      code: 'BAR',
    },
    {
      id: uuid(),
      name: 'Murcia',
      code: 'MUR',
    },
  ];
}
