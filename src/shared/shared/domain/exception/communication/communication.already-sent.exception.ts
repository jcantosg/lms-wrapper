import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class CommunicationAlreadySentException extends ConflictException {
  constructor() {
    super('sga.communication.already-sent');
  }
}
