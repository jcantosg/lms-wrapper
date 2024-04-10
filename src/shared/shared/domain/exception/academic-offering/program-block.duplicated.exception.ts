import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class ProgramBlockDuplicatedException extends ConflictException {
  constructor() {
    super('sga.program-block.duplicated');
  }
}
