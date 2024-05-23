import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class StudentRefreshTokenNotFoundException extends NotFoundException {
  constructor() {
    super('student.student.refresh-token-not-found');
  }
}
