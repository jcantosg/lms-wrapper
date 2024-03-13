import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class AcademicPeriodNotFoundException extends NotFoundException {
  constructor() {
    super('sga.academic-period.not-found');
  }
}
