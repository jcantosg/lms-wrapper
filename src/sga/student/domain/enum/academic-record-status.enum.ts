export enum AcademicRecordStatusEnum {
  VALID = 'En Vigor',
  CANCELLED = 'Cancelado',
  FINISHED = 'Finalizado',
  CANCELLED_TRANSFER = 'Cancelado por traslado',
}

export const getAllAcademicRecordStatusEnum = (): AcademicRecordStatusEnum[] =>
  Object.values(AcademicRecordStatusEnum).filter(
    (value) => value !== AcademicRecordStatusEnum.CANCELLED_TRANSFER,
  );
