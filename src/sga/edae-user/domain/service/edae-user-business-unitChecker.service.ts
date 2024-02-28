import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { EdaeUserNotFoundException } from '#shared/domain/exception/edae-user/edae-user-not-found.exception';

export class EdaeUserBusinessUnitChecker {
  checkBusinessUnits(user: AdminUser, userToCompare: EdaeUser): void {
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
      throw new EdaeUserNotFoundException();
    }
  }
}
