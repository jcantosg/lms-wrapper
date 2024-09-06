import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class CommunicationNotFoundException extends NotFoundException {
  constructor() {
    super('student-360.communication.not-found');
  }
}
