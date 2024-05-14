export enum SubjectCallStatusEnum {
  PASSED = 'Aprobada',
  NOT_PASSED = 'Suspendida',
  RENOUNCED = 'Renuncia',
  NOT_PRESENTED = 'No Presentado',
  ONGOING = 'En Curso',
  NOT_STARTED = 'No Iniciada',
}

export const getAllSubjectCallStatuses = (): SubjectCallStatusEnum[] =>
  Object.values(SubjectCallStatusEnum);
