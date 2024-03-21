import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class SubjectResourceNotFoundException extends NotFoundException {
  constructor() {
    super('sga.subject-resource.not-found');
  }
}
