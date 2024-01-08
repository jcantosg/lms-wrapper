import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetBusinessUnitQuery } from '#business-unit/application/get-business-unit/get-business-unit.query';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class GetBusinessUnitHandler implements QueryHandler {
  constructor(private readonly businessGetterService: BusinessUnitGetter) {}

  async handle(query: GetBusinessUnitQuery): Promise<BusinessUnit> {
    return await this.businessGetterService.get(query.id);
  }
}
