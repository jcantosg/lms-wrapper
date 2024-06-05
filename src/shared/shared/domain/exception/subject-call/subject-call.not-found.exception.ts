import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class SubjectCallNotFoundException extends NotFoundException {
  constructor() {
    super('sga.subject-call.not-found');
  }
}
