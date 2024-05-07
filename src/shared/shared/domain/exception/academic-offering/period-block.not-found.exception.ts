import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class PeriodBlockNotFoundException extends NotFoundException {
  constructor() {
    super('sga.period-block.not-found');
  }
}
