import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class ExaminationCenterDuplicatedCodeException extends ConflictException {
  constructor() {
    super('sga.examination-center.duplicated-code');
  }
}
