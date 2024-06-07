import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class SubjectCallDuplicatedException extends ConflictException {
  constructor() {
    super('sga.subject-call.duplicated');
  }
}
