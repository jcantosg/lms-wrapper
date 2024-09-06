import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class InvalidAdministrativeProcessStatusException extends ConflictException {
  constructor() {
    super('student-360.administrative-process.invalid-status');
  }
}
