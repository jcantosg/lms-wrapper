import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import {
  CountryResponse,
  GetCountryResponse,
} from '#shared/infrastructure/controller/country/get-country.response';

type GetBusinessUnitByUserResponse = {
  id: string;
  name: string;
  code: string;
  country: CountryResponse;
};

export class GetAdminUserDetailResponse {
  static create(adminUser: AdminUser) {
    return {
      id: adminUser.id,
      name: adminUser.name,
      surname: adminUser.surname,
      surname2: adminUser.surname2,
      roles: adminUser.roles,
      businessUnits: adminUser.businessUnits.map(
        (businessUnit: BusinessUnit): GetBusinessUnitByUserResponse => {
          return {
            id: businessUnit.id,
            name: businessUnit.name,
            code: businessUnit.code,
            country: GetCountryResponse.create(businessUnit.country),
          };
        },
      ),
      avatar: adminUser.avatar,
      identityDocument: adminUser.identityDocument.value,
    };
  }
}
