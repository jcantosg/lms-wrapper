import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class TitleNotFoundException extends NotFoundException {
  constructor() {
    super('sga.title.not-found');
  }
}
