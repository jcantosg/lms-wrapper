interface GetUrlWithSessionKeyResponseBody {
  url: string;
}

export class GetUrlWithSessionKeyResponse {
  static create(url: string): GetUrlWithSessionKeyResponseBody {
    return {
      url,
    };
  }
}
