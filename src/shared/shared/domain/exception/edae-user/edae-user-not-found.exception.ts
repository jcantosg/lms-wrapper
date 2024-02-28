import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class EdaeUserNotFoundException extends NotFoundException {
  constructor() {
    super('sga.edae-user.not-found');
  }
}
