import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class AcademicPeriodDuplicatedCodeException extends ConflictException {
  constructor() {
    super('sga.academic-period.duplicated-code');
  }
}
