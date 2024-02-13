import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserNotFoundException } from '#shared/domain/exception/admin-user/admin-user-not-found.exception';

export class AdminUserBusinessUnitsChecker {
  checkBusinessUnits(user: AdminUser, userToCompare: AdminUser): void {
    user.businessUnits.forEach((businessUnit: BusinessUnit) => {
      if (!userToCompare.businessUnits.includes(businessUnit)) {
        throw new AdminUserNotFoundException();
      }
    });
  }
}
