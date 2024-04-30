export enum AccessQualification {
  ESO_EQUIVALENCE = 'ESO o estudios equivalentes',
  ESO_HOMOLOGATED = 'ESO - Homologación',
  FP = 'FP Básica',
  BACHILLER = 'Bachiller',
  BACHILLER_HOMOLOGATED = 'Bachiller- Homologación',
  CFGM_CFAM = 'CFGM-CFAM',
  CFGS_CFAS = 'CFGS-CFAS',
  DIPLOMATURA = 'Diplomatura',
  LICENCIATURA = 'Licenciatura',
  GRADO = 'Grado',
  PRUEBA_ACCESO = 'Prueba de acceso',
  CURSO_ACCESO = 'Curso específico de acceso',
  OTROS = 'Otros',
}

export const getAccessQualification = (): AccessQualification[] => {
  return Object.values(AccessQualification);
};
