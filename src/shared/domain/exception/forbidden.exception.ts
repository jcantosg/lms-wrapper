import { ApplicationException } from './application.exception';

export class ForbiddenException extends ApplicationException {
  constructor(message = 'universae.forbidden') {
    super(message);
  }
}
