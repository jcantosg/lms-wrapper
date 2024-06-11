import { BadRequestException } from '#shared/domain/exception/bad-request.exception';
import { Logger } from '@nestjs/common';

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
    try {
      const response = await fetch(`${this.baseUrl}${url}?${queryParams}`, {
        method: 'POST',
        body: body,
      });

      const responseJson = await response.json();
      this.handleErrors(responseJson);

      return responseJson;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  handleErrors(response: { message: string; exception: string }) {
    if (response.exception) {
      this.logger.error(response.exception, response.message);

      throw new BadRequestException();
    }
  }
}
