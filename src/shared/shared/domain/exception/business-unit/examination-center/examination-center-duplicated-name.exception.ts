import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class ExaminationCenterDuplicatedNameException extends ConflictException {
  constructor() {
    super('sga.examination-center.duplicated-name');
  }
}
