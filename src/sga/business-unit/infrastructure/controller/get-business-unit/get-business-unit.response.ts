import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import {
  CountryResponse,
  GetCountryResponse,
} from '#shared/infrastructure/controller/country/get-country.response';
import {
  GetVirtualCampusResponse,
  VirtualCampusResponse,
} from '#business-unit/infrastructure/controller/get-business-unit/get-virtual-campus.response';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';

export interface BusinessResponse {
  id: string;
  name: string;
  code: string;
  country: CountryResponse;
  virtualCampuses: VirtualCampusResponse[];
}

export class GetBusinessUnitResponse {
  static create(businessUnit: BusinessUnit) {
    return {
      id: businessUnit.id,
      name: businessUnit.name,
      code: businessUnit.code,
      country: GetCountryResponse.create(businessUnit.country),
      virtualCampuses: businessUnit.virtualCampuses.map(
        (virtualCampus: VirtualCampus) => {
          return GetVirtualCampusResponse.create(virtualCampus);
        },
      ),
    };
  }
}
