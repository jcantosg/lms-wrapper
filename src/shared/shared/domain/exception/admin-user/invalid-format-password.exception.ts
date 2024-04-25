import { BadRequestException } from '#shared/domain/exception/bad-request.exception';

export class InvalidFormatPasswordException extends BadRequestException {
  constructor() {
    super('sga.user.invalid_format_password');
  }
}
