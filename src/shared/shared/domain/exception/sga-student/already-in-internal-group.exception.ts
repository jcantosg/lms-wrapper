import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class AlreadyInInternalGroupException extends ConflictException {
  constructor() {
    super('sga.student.already-in-internal-group');
  }
}
