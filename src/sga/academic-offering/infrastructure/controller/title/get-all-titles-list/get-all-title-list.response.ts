import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { Title } from '#academic-offering/domain/entity/title.entity';
import {
  GetTitleResponse,
  TitleResponse,
} from '#academic-offering/infrastructure/controller/title/get-all-titles-list/get-title-list.response';

export class GetAllTitlesResponse {
  static create(
    titles: Title[],
    page: number,
    limit: number,
    total: number,
  ): CollectionResponse<TitleResponse> {
    return {
      items: titles.map((title) => GetTitleResponse.create(title)),
      pagination: {
        page,
        limit,
        total,
      },
    };
  }
}
