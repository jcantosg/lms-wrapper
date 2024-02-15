import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class ExaminationCenterAlreadyAddedException extends ConflictException {
  constructor() {
    super('sga.examination-center.already-added');
  }
}
