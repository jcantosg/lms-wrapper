import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class ProgramBlockMisMatchBusinessUnitException extends ConflictException {
  constructor() {
    super('sga.program-block.mismatch-business-unit');
  }
}
