import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { BusinessUnitResponseBasic } from '#business-unit/infrastructure/controller/business-unit/get-all-business-units/get-business-unit.response';

export class GetAllBusinessUnitPlainResponse {
  static create(businessUnits: BusinessUnit[]): BusinessUnitResponseBasic[] {
    return businessUnits.map((businessUnit) => ({
      id: businessUnit.id,
      name: businessUnit.name,
    }));
  }
}
