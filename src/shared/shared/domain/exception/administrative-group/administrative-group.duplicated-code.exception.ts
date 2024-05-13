import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class AdministrativeGroupDuplicatedCodeException extends ConflictException {
  constructor() {
    super('sga.administrative-group.duplicated-code');
  }
}
