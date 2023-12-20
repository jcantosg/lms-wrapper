import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class CountryNotFoundException extends NotFoundException {
  constructor() {
    super('sga.country.not-found');
  }
}
