import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class InvalidEvaluationTypeException extends ConflictException {
  constructor() {
    super('sga.subject.invalid-evaluation-type');
  }
}
