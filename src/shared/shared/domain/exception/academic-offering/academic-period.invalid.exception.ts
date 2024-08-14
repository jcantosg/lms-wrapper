import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class InvalidAcademicPeriodException extends ConflictException {
  constructor() {
    super('sga.academic-period.invalid');
  }
}
