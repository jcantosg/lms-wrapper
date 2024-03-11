import { BadRequestException } from '#shared/domain/exception/bad-request.exception';

export class SubjectBelowZeroHoursException extends BadRequestException {
  constructor() {
    super('sga.subject-below-zero-hours');
  }
}
