import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class AdministrativeGroupNotFoundException extends NotFoundException {
  constructor() {
    super('sga.administrative-group.not-found');
  }
}
