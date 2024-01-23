import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class ClassroomWrongCapacityException extends ConflictException {
  constructor() {
    super('sga.classroom.wrong-capacity');
  }
}
