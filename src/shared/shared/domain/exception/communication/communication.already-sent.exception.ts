import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class CommunicationAlreadySentException extends ConflictException {
  constructor() {
    super('student-360.communication.already-sent');
  }
}
