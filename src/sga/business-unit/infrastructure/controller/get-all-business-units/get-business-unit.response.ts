import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import {
  CountryResponse,
  GetCountryResponse,
} from '#shared/infrastructure/controller/country/get-country.response';

export interface BusinessUnitResponse {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  country: CountryResponse;
}

export class GetBusinessUnitResponse {
  static create(businessUnit: BusinessUnit) {
    return {
      id: businessUnit.id,
      name: businessUnit.name,
      code: businessUnit.code,
      isActive: businessUnit.isActive,
      country: GetCountryResponse.create(businessUnit.country),
    };
  }
}
