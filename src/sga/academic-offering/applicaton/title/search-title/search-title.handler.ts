import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { SearchTitleQuery } from '#academic-offering/applicaton/title/search-title/search-title.query';
import { SearchTitleCriteria } from '#academic-offering/applicaton/title/search-title/search-title.criteria';

export class SearchTitleHandler implements QueryHandler {
  constructor(private readonly titleRepository: TitleRepository) {}

  async handle(
    query: SearchTitleQuery,
  ): Promise<CollectionHandlerResponse<Title>> {
    const criteria = new SearchTitleCriteria(query);

    const [total, titles] = await Promise.all([
      this.titleRepository.count(
        criteria,
        query.adminUserBusinessUnits,
        query.isSuperAdmin,
      ),
      this.titleRepository.matching(
        criteria,
        query.adminUserBusinessUnits,
        query.isSuperAdmin,
      ),
    ]);

    return {
      total,
      items: titles,
    };
  }
}
