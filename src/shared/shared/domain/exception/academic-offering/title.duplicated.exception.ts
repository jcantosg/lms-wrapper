import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class TitleDuplicatedException extends ConflictException {
  constructor() {
    super('sga.title.duplicated');
  }
}
