import { BadRequestException } from '#shared/domain/exception/bad-request.exception';
import { Logger } from '@nestjs/common';
import { LmsWrapperPostException } from '#lms-wrapper/domain/exception/lms-wrapper-post.exception';

export class FetchWrapper {
  constructor(
    private baseUrl: string,
    private logger: Logger,
  ) {}

  async get(url: string, queryParams: string) {
    try {
      const response = await fetch(`${this.baseUrl}${url}?${queryParams}`);

      return await response.json();
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException();
    }
  }

  async post(
    url: string,
    queryParams: string | null = null,
    body: string | null = null,
  ) {
    const response = await fetch(`${this.baseUrl}${url}?${queryParams}`, {
      method: 'POST',
      body: body,
    });

    const responseJson = await response.json();
    this.handleErrors(responseJson);

    return responseJson;
  }

  handleErrors(
    response: {
      message: string;
      exception: string;
      debuginfo: string | undefined;
    } | null,
  ) {
    if (response && response.exception) {
      this.logger.error(response.exception, response.debuginfo);
      throw new LmsWrapperPostException(response.exception);
    }
  }
}
