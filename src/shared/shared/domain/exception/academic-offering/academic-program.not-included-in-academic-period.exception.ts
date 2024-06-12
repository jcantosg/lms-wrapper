import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class AcademicProgramNotIncludedInAcademicPeriodException extends ConflictException {
  constructor() {
    super('sga.academic-program.not-included-in-academic-period');
  }
}
