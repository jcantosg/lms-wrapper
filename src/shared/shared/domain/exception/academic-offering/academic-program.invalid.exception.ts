import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class InvalidAcademicProgramException extends ConflictException {
  constructor() {
    super('sga.academic-program.invalid');
  }
}
