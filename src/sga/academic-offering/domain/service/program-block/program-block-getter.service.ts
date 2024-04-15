import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { ProgramBlockNotFoundException } from '#shared/domain/exception/academic-offering/program-block.not-found.exception';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class ProgramBlockGetter {
  constructor(private repository: ProgramBlockRepository) {}

  public async get(id: string): Promise<ProgramBlock> {
    const programBlock = await this.repository.get(id);
    if (!programBlock) {
      throw new ProgramBlockNotFoundException();
    }

    return programBlock;
  }

  public async getByAdminUser(
    id: string,
    adminUser: AdminUser,
  ): Promise<ProgramBlock> {
    const programBlock = await this.repository.getByAdminUser(
      id,
      adminUser.businessUnits.map(
        (businessUnit: BusinessUnit) => businessUnit.id,
      ),
      adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );
    if (!programBlock) {
      throw new ProgramBlockNotFoundException();
    }

    return programBlock;
  }
}
