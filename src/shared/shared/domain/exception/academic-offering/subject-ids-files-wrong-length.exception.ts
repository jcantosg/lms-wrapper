import { BadRequestException } from '#shared/domain/exception/bad-request.exception';

export class SubjectIdsFilesWrongLengthException extends BadRequestException {
  constructor() {
    super('sga.subject.id-file-wrong-length');
  }
}
