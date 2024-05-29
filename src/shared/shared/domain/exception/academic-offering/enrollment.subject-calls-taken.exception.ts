import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class EnrollmentSubjectCallsTakenException extends ConflictException {
  constructor() {
    super('sga.enrollment.subject-calls-taken');
  }
}
