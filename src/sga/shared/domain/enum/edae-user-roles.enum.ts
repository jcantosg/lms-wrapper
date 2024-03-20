export enum EdaeRoles {
  DOCENTE = 'Docente',
  TUTOR = 'Tutor',
  RESPONSABLE_TUTOR = 'Responsable tutor',
  COORDINADOR_FCT = 'Coordinador FCT',
  RESPONSABLE_FCT = 'Responsable FCT',
  GESTOR_FCT = 'Gestor FCT',
}

export function getAllEdaeRoles(): string[] {
  return Object.values(EdaeRoles);
}

export function getAllTeacherRoles(): EdaeRoles[] {
  const excludedRoles = [EdaeRoles.GESTOR_FCT];

  return Object.values(EdaeRoles).filter(
    (role) => !excludedRoles.includes(role),
  );
}
