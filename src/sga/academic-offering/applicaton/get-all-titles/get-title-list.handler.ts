import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { GetAllTitlesCriteria } from '#academic-offering/applicaton/get-all-titles/get-title-list.criteria';
import { GetAllTitlesListQuery } from '#academic-offering/applicaton/get-all-titles/get-title-list.query';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { QueryHandler } from '#shared/domain/bus/query.handler';

export class GetTitleListHandler implements QueryHandler {
  constructor(private readonly titleRepository: TitleRepository) {}

  async handle(
    query: GetAllTitlesListQuery,
  ): Promise<CollectionHandlerResponse<Title>> {
    const criteria = new GetAllTitlesCriteria(query);

    const [total, titles] = await Promise.all([
      this.titleRepository.count(
        criteria,
        query.adminBusinessUnits,
        query.isSuperAdmin,
      ),
      this.titleRepository.matching(
        criteria,
        query.adminBusinessUnits,
        query.isSuperAdmin,
      ),
    ]);

    return {
      total,
      items: titles,
    };
  }
}
