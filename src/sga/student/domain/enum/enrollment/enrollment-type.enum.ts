export enum EnrollmentTypeEnum {
  UNIVERSAE = 'UNIVERSAE',
  CV = 'CV',
  VALIDATED = 'Reconocida',
}

export const getAllEnrollmentTypes = (): EnrollmentTypeEnum[] =>
  Object.values(EnrollmentTypeEnum);
