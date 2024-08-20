import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class CommunicationNotFoundException extends NotFoundException {
  constructor() {
    super('sga.communication.not-found');
  }
}
