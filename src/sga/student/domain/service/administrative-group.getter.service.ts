import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AdministrativeGroupNotFoundException } from '#shared/domain/exception/administrative-group/administrative-group.not-found.exception';

export class AdministrativeGroupGetter {
  constructor(private readonly repository: AdministrativeGroupRepository) {}

  async getByAdminUser(
    id: string,
    adminUser: AdminUser,
  ): Promise<AdministrativeGroup> {
    const administrativeGroup = await this.repository.getByAdminUser(
      id,
      adminUser.businessUnits.map((bu) => bu.id),
      adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    if (!administrativeGroup) {
      throw new AdministrativeGroupNotFoundException();
    }

    return administrativeGroup;
  }
}
