import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class StudentAcademicRecordNotFoundException extends NotFoundException {
  constructor() {
    super('student.academic-record.not-found');
  }
}
