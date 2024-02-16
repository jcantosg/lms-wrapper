export enum AdminUserRoles {
  SUPERADMIN = 'superadmin',
  SUPERVISOR_JEFATURA = 'supervisor_jefatura',
  SUPERVISOR_360 = 'supervisor_360',
  SUPERVISOR_SECRETARIA = 'supervisor_secretaria',
  SECRETARIA = 'secretaria',
  GESTOR_360 = 'gestor_360',
  JEFATURA = 'jefatura',
}

export const rolePermissionsMap = new Map<AdminUserRoles, AdminUserRoles[]>([
  [AdminUserRoles.SUPERADMIN, Object.values(AdminUserRoles)],
  [
    AdminUserRoles.SUPERVISOR_JEFATURA,
    [AdminUserRoles.JEFATURA, AdminUserRoles.SUPERVISOR_JEFATURA],
  ],
  [AdminUserRoles.JEFATURA, [AdminUserRoles.JEFATURA]],
  [
    AdminUserRoles.SUPERVISOR_360,
    [AdminUserRoles.GESTOR_360, AdminUserRoles.SUPERVISOR_360],
  ],
  [AdminUserRoles.GESTOR_360, [AdminUserRoles.GESTOR_360]],
  [
    AdminUserRoles.SUPERVISOR_SECRETARIA,
    [AdminUserRoles.SECRETARIA, AdminUserRoles.SUPERVISOR_SECRETARIA],
  ],
  [AdminUserRoles.SECRETARIA, [AdminUserRoles.SECRETARIA]],
]);

export function getAdminUserRoles(roles: AdminUserRoles[]): AdminUserRoles[] {
  const result: AdminUserRoles[] = [];

  for (const role of roles) {
    result.push(...rolePermissionsMap.get(role)!);
  }

  return [...new Set(result)];
}
