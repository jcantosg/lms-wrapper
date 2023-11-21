import { ApplicationException } from './application.exception';

export class NotFoundException extends ApplicationException {
  constructor(message = 'universae.not_found') {
    super(message);
  }
}
