import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class SubjectCallMaxReachedException extends ConflictException {
  constructor() {
    super('sga.subject-call.max-reached');
  }
}
