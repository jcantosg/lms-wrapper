import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class StudentSubjectNotFoundException extends NotFoundException {
  constructor() {
    super('student.subject.not-found');
  }
}
