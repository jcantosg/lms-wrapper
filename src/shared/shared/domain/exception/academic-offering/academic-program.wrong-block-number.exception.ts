import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class AcademicProgramWrongBlockNumberException extends ConflictException {
  constructor() {
    super('sga.academic-program.wrong-block-number');
  }
}
