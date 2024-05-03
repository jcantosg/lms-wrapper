export enum AcademicRecordStatusEnum {
  VALID = 'En Vigor',
  CANCELLED = 'Cancelado',
  FINISHED = 'Finalizado',
}

export const getAllAcademicRecordStatusEnum = (): AcademicRecordStatusEnum[] =>
  Object.values(AcademicRecordStatusEnum);
