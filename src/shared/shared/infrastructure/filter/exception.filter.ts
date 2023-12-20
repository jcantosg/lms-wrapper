import {
  ArgumentsHost,
  BadRequestException as HttpBadRequestException,
  Catch,
  ConflictException as HttpConflictException,
  ForbiddenException as HttpForbiddenException,
  NotFoundException as HttpNotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ApplicationException } from '#shared/domain/exception/application.exception';
import { NotFoundException } from '#shared/domain/exception/not-found.exception';
import { ForbiddenException } from '#shared/domain/exception/forbidden.exception';
import { BadRequestException } from '#shared/domain/exception/bad-request.exception';
import { ConflictException } from '#shared/domain/exception/conflict.exception';

@Catch(ApplicationException)
export class ApplicationExceptionFilter extends BaseExceptionFilter {
  catch(exception: ApplicationException, host: ArgumentsHost): any {
    if (exception instanceof NotFoundException) {
      super.catch(new HttpNotFoundException(exception.message), host);
    }

    if (exception instanceof ForbiddenException) {
      super.catch(new HttpForbiddenException(exception.message), host);
    }

    if (exception instanceof BadRequestException) {
      super.catch(new HttpBadRequestException(exception.message), host);
    }

    if (exception instanceof ConflictException) {
      super.catch(new HttpConflictException(exception.message), host);
    }
  }
}
