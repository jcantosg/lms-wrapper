import { SetMetadata } from '@nestjs/common';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AdminUserRoles[]) =>
  SetMetadata(ROLES_KEY, roles);
