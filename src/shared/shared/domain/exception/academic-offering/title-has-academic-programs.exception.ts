import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class TitleHasAcademicProgramsException extends ConflictException {
  constructor() {
    super('sga.title.has-academic-programs');
  }
}
