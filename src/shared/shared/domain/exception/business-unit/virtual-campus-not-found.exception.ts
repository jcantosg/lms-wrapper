import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class VirtualCampusNotFoundException extends NotFoundException {
  constructor() {
    super('sga.virtual-campus.virtual-campus-not-found');
  }
}
