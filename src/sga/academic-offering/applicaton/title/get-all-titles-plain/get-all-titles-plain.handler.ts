import { QueryHandler } from '#shared/domain/bus/query.handler';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { GetAllTitlesPlainQuery } from '#academic-offering/applicaton/title/get-all-titles-plain/get-all-titles-plain.query';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';

export class GetAllTitlesPlainHandler implements QueryHandler {
  constructor(private readonly repository: TitleRepository) {}

  async handle(query: GetAllTitlesPlainQuery): Promise<Title[]> {
    const businessUnitIds = query.businessUnitIds;

    const isBusinessUnitAccessible = businessUnitIds.every((id) =>
      query.adminUserBusinessUnits.includes(id),
    );

    if (!isBusinessUnitAccessible) {
      throw new BusinessUnitNotFoundException();
    }

    return this.repository.getByBusinessUnits(businessUnitIds);
  }
}
