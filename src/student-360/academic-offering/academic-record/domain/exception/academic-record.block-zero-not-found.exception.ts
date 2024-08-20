import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class AcademicRecordBlockZeroNotFoundException extends NotFoundException {
  constructor() {
    super('student-360.academic-record.block-zero-not-found');
  }
}
