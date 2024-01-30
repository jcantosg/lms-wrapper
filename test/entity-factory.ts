import { v4 as uuid } from 'uuid';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';

export const getACountry = (id = uuid()): Country => {
  return Country.create(id, 'ES', 'ESP', 'España', '+34', '🇪🇸');
};

export const getAnAdminUser = (id = uuid()): AdminUser => {
  return AdminUser.create(
    id,
    'test@email.com',
    'password',
    [AdminUserRoles.SUPERADMIN],
    'name',
    'avatar',
    [],
  );
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

export const getAVirtualCampus = (id = uuid()): VirtualCampus => {
  return VirtualCampus.create(
    id,
    'name',
    'code',
    getABusinessUnit(),
    getAnAdminUser(),
  );
};

export const getAnExaminationCenter = (
  id: string = uuid(),
): ExaminationCenter => {
  return ExaminationCenter.create(
    id,
    'name',
    'code',
    [],
    'address',
    getAnAdminUser(),
    getACountry(),
  );
};
export const getAMainExaminationCenter = (
  id: string = uuid(),
): ExaminationCenter => {
  return ExaminationCenter.createFromBusinessUnit(
    id,
    getABusinessUnit(),
    getAnAdminUser(),
    'code',
  );
};

export const getAClassroom = (id: string = uuid()): Classroom => {
  return Classroom.create(
    id,
    'code',
    'name',
    4,
    getAnAdminUser(),
    getAnExaminationCenter(),
  );
};
