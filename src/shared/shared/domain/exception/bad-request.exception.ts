import { ApplicationException } from '#shared/domain/exception/application.exception';

export class BadRequestException extends ApplicationException {
  constructor(message = 'universae.bad_request') {
    super(message);
  }
}
