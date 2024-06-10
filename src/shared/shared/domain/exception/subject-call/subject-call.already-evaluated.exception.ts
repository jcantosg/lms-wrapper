import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class SubjectCallAlreadyEvaluatedException extends ConflictException {
  constructor() {
    super('sga.subject-call.already-evaluated');
  }
}
