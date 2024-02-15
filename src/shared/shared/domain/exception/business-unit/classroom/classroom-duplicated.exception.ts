import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class ClassroomDuplicatedException extends ConflictException {
  constructor() {
    super('sga.classroom.duplicated-name');
  }
}
