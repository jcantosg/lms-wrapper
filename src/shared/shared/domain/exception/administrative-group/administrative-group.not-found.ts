import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class AdministrativeGroupNotFound extends NotFoundException {
  constructor() {
    super('sga.administrative-group.not-found');
  }
}
