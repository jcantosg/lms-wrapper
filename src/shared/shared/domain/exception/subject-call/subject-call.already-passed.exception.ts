import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class SubjectCallAlreadyPassedException extends ConflictException {
  constructor() {
    super('sga.subject-call.already-passed');
  }
}
