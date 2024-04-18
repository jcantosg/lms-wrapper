import { ApplicationException } from '#shared/domain/exception/application.exception';

export class UnauthorizedException extends ApplicationException {
  constructor(message = 'universae.unauthorized') {
    super(message);
  }
}
