import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class StudentNotFoundException extends NotFoundException {
  constructor() {
    super('sga.student.not-found');
  }
}
