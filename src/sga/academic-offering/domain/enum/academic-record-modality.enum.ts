export enum AcademicRecordModalityEnum {
  ELEARNING = 'E-Learning',
  MIXED = 'Mixta',
  PRESENCIAL = 'Presencial',
}

export const getAllAcademicRecordModalities =
  (): AcademicRecordModalityEnum[] => Object.values(AcademicRecordModalityEnum);
