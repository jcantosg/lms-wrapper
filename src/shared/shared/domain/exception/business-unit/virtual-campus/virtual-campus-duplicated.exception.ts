import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class VirtualCampusDuplicatedException extends ConflictException {
  constructor() {
    super('sga.virtual-campus.duplicated-virtual-campus');
  }
}
