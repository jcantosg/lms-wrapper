import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit-not-found.exception';

export class BusinessUnitGetter {
  constructor(
    private readonly businessUnitRepository: BusinessUnitRepository,
  ) {}

  async get(id: string): Promise<BusinessUnit> {
    const businessUnit = await this.businessUnitRepository.get(id);

    if (!businessUnit) {
      throw new BusinessUnitNotFoundException();
    }

    return businessUnit;
  }
}
