import { QueryHandler } from '#shared/domain/bus/query.handler';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { GetAllTitlesPlainQuery } from '#academic-offering/applicaton/get-all-titles-plain/get-all-titles-plain.query';
import { Title } from '#academic-offering/domain/entity/title.entity';

export class GetAllTitlesPlainHandler implements QueryHandler {
  constructor(
    private readonly repository: TitleRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
  ) {}

  async handle(query: GetAllTitlesPlainQuery): Promise<Title[]> {
    const businessUnit = await this.businessUnitGetter.getByAdminUser(
      query.businessUnitId,
      query.adminUserBusinessUnits,
    );

    return await this.repository.getByBusinessUnit(businessUnit);
  }
}
