import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class ExaminationCenterMainException extends ConflictException {
  constructor() {
    super('sga.examination-center.main-examination-center');
  }
}
