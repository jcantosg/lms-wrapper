import { CommandHandler } from '#shared/domain/bus/command.handler';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { EditTitleCommand } from '#academic-offering/applicaton/edit-title/edit-title.command';
import { TitleGetter } from '#academic-offering/domain/service/title-getter.service';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class EditTitleHandler implements CommandHandler {
  constructor(
    private readonly titleRepository: TitleRepository,
    private readonly titleGetter: TitleGetter,
    private readonly businessUnitGetter: BusinessUnitGetter,
  ) {}

  async handle(command: EditTitleCommand): Promise<void> {
    const title = await this.titleGetter.getByAdminUser(
      command.id,
      command.adminUser.businessUnits.map((bu) => bu.id),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const adminUserBusinessUnitsId = command.adminUser.businessUnits.map(
      (bu: BusinessUnit) => bu.id,
    );

    const businessUnit = await this.businessUnitGetter.getByAdminUser(
      command.businessUnitId,
      adminUserBusinessUnitsId,
    );

    title.update(
      command.name,
      command.officialCode,
      command.officialTitle,
      command.officialProgram,
      businessUnit,
      command.adminUser,
    );

    await this.titleRepository.save(title);
  }
}
