import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { QueryHandler } from '#shared/domain/bus/query.handler';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class GetAllBusinessUnitsPlainHandler implements QueryHandler {
  constructor(
    private readonly businessUnitRepository: BusinessUnitRepository,
  ) {}

  async handle(): Promise<BusinessUnit[]> {
    return this.businessUnitRepository.getAll();
  }
}
