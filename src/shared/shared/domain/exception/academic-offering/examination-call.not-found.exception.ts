import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class ExaminationCallNotFoundException extends NotFoundException {
  constructor() {
    super('sga.examination-call.not-found');
  }
}
