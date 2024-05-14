export enum EnrollmentVisibilityEnum {
  YES = 'Sí',
  NO = 'No',
  PD = 'PD',
}

export const getAllEnrollmentVisibilities = (): EnrollmentVisibilityEnum[] =>
  Object.values(EnrollmentVisibilityEnum);
