import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class ProgramBlockNotFoundException extends NotFoundException {
  constructor() {
    super('sga.program-block.not-found');
  }
}
