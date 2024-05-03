import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class AcademicRecordNotFoundException extends NotFoundException {
  constructor() {
    super('sga.academic-record.not-found');
  }
}
