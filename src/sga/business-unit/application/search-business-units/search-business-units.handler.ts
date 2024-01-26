import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { SearchBusinessUnitsQuery } from '#business-unit/application/search-business-units/search-business-units.query';
import { SearchBusinessUnitsCriteria } from '#business-unit/application/search-business-units/search-business-units.criteria';

export class SearchBusinessUnitsHandler implements QueryHandler {
  constructor(
    private readonly businessUnitRepository: BusinessUnitRepository,
  ) {}

  async handle(
    query: SearchBusinessUnitsQuery,
  ): Promise<CollectionHandlerResponse<BusinessUnit>> {
    const criteria = new SearchBusinessUnitsCriteria(query);

    const [total, businessUnits] = await Promise.all([
      this.businessUnitRepository.count(criteria, query.adminUserBusinessUnits),
      this.businessUnitRepository.matching(
        criteria,
        query.adminUserBusinessUnits,
      ),
    ]);

    return {
      total,
      items: businessUnits,
    };
  }
}
