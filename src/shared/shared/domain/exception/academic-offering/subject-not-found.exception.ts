import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class SubjectNotFoundException extends NotFoundException {
  constructor() {
    super('sga.subject.not-found');
  }
}
