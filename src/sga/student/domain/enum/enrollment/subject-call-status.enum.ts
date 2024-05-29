import { SubjectCall } from '#student/domain/entity/subject-call.entity';

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

export const isSubjectCallTaken = (subjectCall: SubjectCall): boolean => {
  return ![
    SubjectCallStatusEnum.NOT_STARTED,
    SubjectCallStatusEnum.ONGOING,
  ].includes(subjectCall.status);
};
