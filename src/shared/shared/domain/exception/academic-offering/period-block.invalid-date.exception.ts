import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class PeriodBlockInvalidDateException extends ConflictException {
  constructor() {
    super('sga.period-block.invalid-date');
  }
}
