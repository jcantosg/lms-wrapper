import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class PeriodBlockInvalidException extends ConflictException {
  constructor() {
    super('sga.period-block.invalid');
  }
}
