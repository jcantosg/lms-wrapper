import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class ExaminationCenterDuplicatedException extends ConflictException {
  constructor() {
    super('sga.examination-center.duplicated');
  }
}
