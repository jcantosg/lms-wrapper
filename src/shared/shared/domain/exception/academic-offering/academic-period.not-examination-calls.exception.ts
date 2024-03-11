import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class AcademicPeriodNotExaminationCallsException extends ConflictException {
  constructor() {
    super('sga.academic-period.not-examination-calls');
  }
}
