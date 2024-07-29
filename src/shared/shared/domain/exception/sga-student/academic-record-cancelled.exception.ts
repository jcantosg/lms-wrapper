import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class AcademicRecordCancelledException extends ConflictException {
  constructor() {
    super('sga.academic-record.cancelled');
  }
}
