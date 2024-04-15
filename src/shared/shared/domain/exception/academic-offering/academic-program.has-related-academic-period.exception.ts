import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class AcademicProgramHasRelatedAcademicPeriodException extends ConflictException {
  constructor() {
    super('sga.academic-program.has-related-academic-period');
  }
}
