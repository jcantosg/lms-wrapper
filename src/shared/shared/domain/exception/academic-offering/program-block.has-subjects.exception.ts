import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class ProgramBlockHasSubjectsException extends ConflictException {
  constructor() {
    super('sga.program-block.has-subjects');
  }
}
