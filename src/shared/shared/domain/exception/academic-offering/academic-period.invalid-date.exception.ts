import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class AcademicPeriodInvalidDateException extends ConflictException {
  constructor() {
    super('sga.academic-period.invalid-date');
  }
}
