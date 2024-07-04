import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class CantRemoveDefaultTeacherException extends ConflictException {
  constructor() {
    super('sga.internal-group.cant-remove-default-teacher');
  }
}
