import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class ClassroomNotFoundException extends NotFoundException {
  constructor() {
    super('sga.classroom.not-found');
  }
}
