import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { GetBusinessUnitResponse } from './get-business-unit.response';
import { BusinessUnitResponse } from '#business-unit/infrastructure/controller/get-all-business-units/get-business-unit.response';

export class GetAllBusinessUnitResponse {
  static create(
    businessUnits: BusinessUnit[],
    page: number,
    count: number,
    total: number,
  ): CollectionResponse<BusinessUnitResponse> {
    return {
      items: businessUnits.map((businessUnit) =>
        GetBusinessUnitResponse.create(businessUnit),
      ),
      pagination: {
        page,
        count,
        total,
      },
    };
  }
}
