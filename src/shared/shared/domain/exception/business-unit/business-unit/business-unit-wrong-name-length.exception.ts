import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class BusinessUnitWrongNameLengthException extends ConflictException {
  constructor() {
    super('sga.examination-center.wrong-name-length');
  }
}
