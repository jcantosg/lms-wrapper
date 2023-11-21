import { ApplicationException } from './application.exception';

export class ConflictException extends ApplicationException {
  constructor(message = 'universae.conflict') {
    super(message);
  }
}
