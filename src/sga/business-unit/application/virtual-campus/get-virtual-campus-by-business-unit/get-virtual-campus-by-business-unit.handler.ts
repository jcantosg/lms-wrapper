import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetVirtualCampusByBusinessUnitQuery } from '#business-unit/application/virtual-campus/get-virtual-campus-by-business-unit/get-virtual-campus-by-business-unit.query';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';

export class GetVirtualCampusByBusinessUnitHandler implements QueryHandler {
  constructor(
    private readonly virtualCampusRepository: VirtualCampusRepository,
  ) {}

  async handle(
    query: GetVirtualCampusByBusinessUnitQuery,
  ): Promise<VirtualCampus[]> {
    const isBusinessUnitAccessible = query.adminUser.businessUnits.some(
      (bu) => {
        return bu.id === query.businessUnit;
      },
    );

    if (!isBusinessUnitAccessible) {
      throw new BusinessUnitNotFoundException();
    }

    return this.virtualCampusRepository.getByBusinessUnit(query.businessUnit);
  }
}
