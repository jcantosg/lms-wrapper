import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

type GetBusinessUnitByUserResponse = {
  id: string;
  name: string;
};

export class GetAdminUserDetailResponse {
  static create(adminUser: AdminUser) {
    return {
      id: adminUser.id,
      name: adminUser.name,
      surname: adminUser.surname,
      surname2: adminUser.surname2,
      avatar: adminUser.avatar,
      identityDocument: {
        identityDocumentType: adminUser.identityDocument.identityDocumentType,
        identityDocumentNumber:
          adminUser.identityDocument.identityDocumentNumber,
      },
      createdAt: adminUser.createdAt,
      email: adminUser.email,
      businessUnits: adminUser.businessUnits.map(
        (businessUnit: BusinessUnit): GetBusinessUnitByUserResponse => {
          return {
            id: businessUnit.id,
            name: businessUnit.name,
          };
        },
      ),
      roles: adminUser.roles,
    };
  }
}
