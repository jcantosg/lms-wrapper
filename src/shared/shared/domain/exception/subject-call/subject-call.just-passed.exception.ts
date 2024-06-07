import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class SubjectCallJustPassedException extends ConflictException {
  constructor() {
    super('sga.subject-call.just-passed');
  }
}
