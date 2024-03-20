import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class SubjectInvalidEdaeUserRoleException extends ConflictException {
  constructor() {
    super('sga.subject.invalid-edae-user-role');
  }
}
