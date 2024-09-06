import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class AdministrativeProcessNotFoundException extends NotFoundException {
  constructor() {
    super('sga.administrative-process.not-found');
  }
}
