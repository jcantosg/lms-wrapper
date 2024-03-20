import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class AcademicProgramNotFoundException extends NotFoundException {
  constructor() {
    super('sga.academic-program.not-found');
  }
}
