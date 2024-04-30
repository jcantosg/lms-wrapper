import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class AcademicRecordDuplicatedException extends ConflictException {
  constructor() {
    super('sga.academic-record.duplicated');
  }
}
