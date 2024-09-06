import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class LmsEnrollmentNotInEnrollmentException extends ConflictException {
  constructor() {
    super('lms-wrapper.enrollment.not-in-enrollment');
  }
}
