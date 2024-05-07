import { PeriodBlockRepository } from '#academic-offering/domain/repository/period-block.repository';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { PeriodBlockNotFoundException } from '#shared/domain/exception/academic-offering/period-block.not-found.exception';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class PeriodBlockGetter {
  constructor(private repository: PeriodBlockRepository) {}

  public async get(id: string): Promise<PeriodBlock> {
    const periodBlock = await this.repository.get(id);
    if (!periodBlock) {
      throw new PeriodBlockNotFoundException();
    }

    return periodBlock;
  }

  public async getByAdminUser(
    id: string,
    adminUser: AdminUser,
  ): Promise<PeriodBlock> {
    const periodBlock = await this.repository.getByAdminUser(
      id,
      adminUser.businessUnits.map(
        (businessUnit: BusinessUnit) => businessUnit.id,
      ),
      adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );
    if (!periodBlock) {
      throw new PeriodBlockNotFoundException();
    }

    return periodBlock;
  }
}
