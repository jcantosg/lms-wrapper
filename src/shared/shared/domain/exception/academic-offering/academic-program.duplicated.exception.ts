import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class AcademicProgramDuplicatedException extends ConflictException {
  constructor() {
    super('sga.academic-program.duplicated');
  }
}
