import { ForbiddenException } from '../forbidden.exception';

export class CountryDuplicatedException extends ForbiddenException {
  constructor() {
    super('sga.business-unit.country-duplicated-exception');
  }
}
