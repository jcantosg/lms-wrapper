import { SubjectCall } from '#student/domain/entity/subject-call.entity';

export enum SubjectCallStatusEnum {
  PASSED = 'Aprobada',
  NOT_PASSED = 'Suspendida',
  RENOUNCED = 'Renuncia',
  NOT_PRESENTED = 'No Presentado',
  ONGOING = 'En Curso',
}

export const getAllSubjectCallStatuses = (): SubjectCallStatusEnum[] =>
  Object.values(SubjectCallStatusEnum);

export const isSubjectCallTaken = (subjectCall: SubjectCall): boolean => {
  return ![SubjectCallStatusEnum.ONGOING].includes(subjectCall.status);
};
