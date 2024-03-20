import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class SubjectResourceDuplicatedException extends ConflictException {
  constructor() {
    super('sga.subject-resource.duplicated');
  }
}
