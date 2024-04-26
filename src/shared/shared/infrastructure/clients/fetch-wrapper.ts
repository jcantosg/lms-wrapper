import { BadRequestException } from '#shared/domain/exception/bad-request.exception';

export class FetchWrapper {
  constructor(private baseUrl: string) {}

  async get(url: string, queryParams: string) {
    try {
      const response = await fetch(`${this.baseUrl}${url}?${queryParams}`);

      return await response.json();
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
