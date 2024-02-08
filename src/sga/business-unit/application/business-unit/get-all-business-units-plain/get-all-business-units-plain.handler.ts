import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { QueryHandler } from '#shared/domain/bus/query.handler';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { GetAllBusinessUnitsPlainQuery } from '#business-unit/application/business-unit/get-all-business-units-plain/get-all-business-units-plain.query';

export class GetAllBusinessUnitsPlainHandler implements QueryHandler {
  constructor(
    private readonly businessUnitRepository: BusinessUnitRepository,
  ) {}

  async handle(query: GetAllBusinessUnitsPlainQuery): Promise<BusinessUnit[]> {
    return this.businessUnitRepository.getAll(query.adminUserBusinessUnits);
  }
}
