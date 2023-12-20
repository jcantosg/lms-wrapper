import { v4 as uuid } from 'uuid';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export const getACountry = (id = uuid()): Country => {
  return Country.create(id, 'ES', 'ESP', 'España', '+34', '🇪🇸');
};

export const getAnAdminUser = (id = uuid()): AdminUser => {
  return AdminUser.create(id, 'test@email.com', 'password', [
    AdminUserRoles.SUPERADMIN,
  ]);
};

export const getABusinessUnit = (id = uuid()): BusinessUnit => {
  return BusinessUnit.create(
    id,
    'name',
    'code',
    getACountry(),
    getAnAdminUser(),
  );
};
