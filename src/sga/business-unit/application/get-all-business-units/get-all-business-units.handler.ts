import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetAllBusinessUnitsQuery } from '#business-unit/application/get-all-business-units/get-all-business-units.query';
import { GetAllBusinessUnitsCriteria } from '#business-unit/application/get-all-business-units/get-all-business-units.criteria';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class GetAllBusinessUnitsHandler implements QueryHandler {
  constructor(
    private readonly businessUnitRepository: BusinessUnitRepository,
  ) {}

  async handle(
    query: GetAllBusinessUnitsQuery,
  ): Promise<CollectionHandlerResponse<BusinessUnit>> {
    const criteria = new GetAllBusinessUnitsCriteria(query);

    const [total, businessUnits] = await Promise.all([
      this.businessUnitRepository.count(criteria),
      this.businessUnitRepository.matching(criteria),
    ]);

    return {
      total,
      items: businessUnits,
    };
  }
}
