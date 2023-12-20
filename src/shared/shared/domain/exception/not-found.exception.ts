import { ApplicationException } from '#shared/domain/exception/application.exception';

export class NotFoundException extends ApplicationException {
  constructor(message = 'universae.not_found') {
    super(message);
  }
}
