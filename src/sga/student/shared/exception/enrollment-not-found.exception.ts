import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class EnrollmentNotFoundException extends NotFoundException {
  constructor() {
    super('sga.enrollment.not-found');
  }
}
