import { ApplicationException } from '#shared/domain/exception/application.exception';

export class ForbiddenException extends ApplicationException {
  constructor(message = 'universae.forbidden') {
    super(message);
  }
}
