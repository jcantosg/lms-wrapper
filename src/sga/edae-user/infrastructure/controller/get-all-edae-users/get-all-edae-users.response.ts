import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { GetBusinessUnitResponse } from '#business-unit/infrastructure/controller/business-unit/get-all-business-units/get-business-unit.response';
import { GetCountryResponse } from '#shared/infrastructure/controller/country/get-country.response';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

interface GetEdaeUserResponse {
  id: string;
  name: string;
  surname1: string;
  email: string;
  roles: EdaeRoles[];
  businessUnits: GetBusinessUnitResponse[];
  location: GetCountryResponse;
  avatar: string | null;
}

export class GetAllEdaeUsersResponse {
  static create(
    edaeUsers: EdaeUser[],
    page: number,
    limit: number,
    total: number,
  ): CollectionResponse<GetEdaeUserResponse> {
    return {
      items: edaeUsers.map(
        (edaeUser: EdaeUser): GetEdaeUserResponse => ({
          id: edaeUser.id,
          name: edaeUser.name,
          surname1: edaeUser.surname1,
          email: edaeUser.email,
          roles: edaeUser.roles,
          businessUnits: edaeUser.businessUnits.map(
            (businessUnit: BusinessUnit): GetBusinessUnitResponse =>
              GetBusinessUnitResponse.create(businessUnit),
          ),
          location: GetCountryResponse.create(edaeUser.location),
          avatar: edaeUser.avatar,
        }),
      ),
      pagination: {
        page: page,
        limit: limit,
        total: total,
      },
    };
  }
}
