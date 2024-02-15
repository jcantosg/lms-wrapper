import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class ClassroomDuplicatedCodeException extends ConflictException {
  constructor() {
    super('sga.classroom.duplicated-code');
  }
}
