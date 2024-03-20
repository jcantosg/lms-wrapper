import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class AcademicProgramDuplicatedCodeException extends ConflictException {
  constructor() {
    super('sga.academic-program.duplicated-code');
  }
}
