import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class EdaeUserDuplicatedException extends ConflictException {
  constructor() {
    super('sga.edae-user.duplicated');
  }
}
