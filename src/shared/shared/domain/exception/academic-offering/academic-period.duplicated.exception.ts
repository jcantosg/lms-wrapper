import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class AcademicPeriodDuplicatedException extends ConflictException {
  constructor() {
    super('sga.academic-period.duplicated');
  }
}
