import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class AcademicPeriodWrongBlockNumberException extends ConflictException {
  constructor() {
    super('sga.academic-period.wrong-block-number');
  }
}
