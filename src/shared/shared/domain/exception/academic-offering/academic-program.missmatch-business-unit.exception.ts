import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class AcademicProgramMisMatchBusinessUnitException extends ConflictException {
  constructor() {
    super('sga.academic-program.missmatch-business-unit');
  }
}
