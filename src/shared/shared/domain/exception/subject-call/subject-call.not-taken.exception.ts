import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class SubjectCallNotTakenException extends ConflictException {
  constructor() {
    super('sga.subject-call.not-taken');
  }
}
