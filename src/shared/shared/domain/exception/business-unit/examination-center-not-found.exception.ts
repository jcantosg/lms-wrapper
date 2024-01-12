import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class ExaminationCenterNotFoundException extends NotFoundException {
  constructor() {
    super('sga.examination-center.not-found');
  }
}
