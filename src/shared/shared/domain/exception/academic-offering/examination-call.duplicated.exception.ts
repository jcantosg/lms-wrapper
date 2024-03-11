import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class ExaminationCallDuplicatedException extends ConflictException {
  constructor() {
    super('sga.examination-call.duplicated');
  }
}
