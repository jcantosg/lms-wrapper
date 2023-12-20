import { ApplicationException } from '#shared/domain/exception/application.exception';

export class ConflictException extends ApplicationException {
  constructor(message = 'universae.conflict') {
    super(message);
  }
}
