import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class ProvinceNotFoundException extends NotFoundException {
  constructor() {
    super('sga.province.not-found');
  }
}
