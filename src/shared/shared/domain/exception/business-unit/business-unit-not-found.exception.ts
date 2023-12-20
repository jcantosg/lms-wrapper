import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class BusinessUnitNotFoundException extends NotFoundException {
  constructor() {
    super('sga.business-unit.business-unit-not-found');
  }
}
