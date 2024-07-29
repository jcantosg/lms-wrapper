import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class LmsWrapperPostException extends ConflictException {
  constructor(message: string) {
    super(`lms-wrapper.post-error.${message}`);
  }
}
