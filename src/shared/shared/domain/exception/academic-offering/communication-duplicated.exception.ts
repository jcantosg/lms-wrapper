import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class CommunicationDuplicatedException extends ConflictException {
  constructor() {
    super('sga.communication.duplicated');
  }
}
