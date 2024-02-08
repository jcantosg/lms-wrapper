import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class InvalidIdentityDocumentException extends ConflictException {
  constructor() {
    super('sga.identity-document.invalid');
  }
}
