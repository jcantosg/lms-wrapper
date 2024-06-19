import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class InternalGroupNotFoundException extends NotFoundException {
  constructor() {
    super('sga.internal-group.not-found');
  }
}
