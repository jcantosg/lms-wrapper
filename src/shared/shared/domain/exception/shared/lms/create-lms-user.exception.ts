import { ApplicationException } from '#shared/domain/exception/application.exception';

export class CreateLmsStudentException extends ApplicationException {
  constructor() {
    super('sga.shared.create-lms-student-exception');
  }
}
