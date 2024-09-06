import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class SubjectHasEnrollmentsException extends ConflictException {
  constructor() {
    super('sga.subject.has-enrollments');
  }
}
