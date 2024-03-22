import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class VirtualCampusNotFoundException extends NotFoundException {
  constructor() {
    super('sga.virtual-campus.not-found');
  }
}
