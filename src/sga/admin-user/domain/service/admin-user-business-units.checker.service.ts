import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserNotFoundException } from '#shared/domain/exception/admin-user/admin-user-not-found.exception';

export class AdminUserBusinessUnitsChecker {
  checkBusinessUnits(user: AdminUser, userToCompare: AdminUser): void {
    const businessUnitsId = user.businessUnits.map(
      (businessUnit: BusinessUnit) => businessUnit.id,
    );
    const businessUnitsIdToCompare = userToCompare.businessUnits.map(
      (businessUnit: BusinessUnit) => businessUnit.id,
    );
    let result = false;
    businessUnitsId.forEach((businessUnit: string) => {
      if (businessUnitsIdToCompare.includes(businessUnit)) {
        result = true;
      }
    });
    if (!result) {
      throw new AdminUserNotFoundException();
    }
  }
}
