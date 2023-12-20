import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class BusinessUnitDuplicatedException extends ConflictException {
  constructor() {
    super('sga.business-unit.duplicated-business-unit');
  }
}
