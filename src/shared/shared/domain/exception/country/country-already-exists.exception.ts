import { ForbiddenException } from '#shared/domain/exception/forbidden.exception';

export class CountryDuplicatedException extends ForbiddenException {
  constructor() {
    super('sga.business-unit.country-duplicated-exception');
  }
}
