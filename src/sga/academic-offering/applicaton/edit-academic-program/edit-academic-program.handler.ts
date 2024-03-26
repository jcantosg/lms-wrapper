import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { TitleGetter } from '#academic-offering/domain/service/title-getter.service';
import { AcademicProgramDuplicatedCodeException } from '#shared/domain/exception/academic-offering/academic-program.duplicated-code.exception';
import { EditAcademicProgramCommand } from '#academic-offering/applicaton/edit-academic-program/edit-academic-program.command';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program-getter.service';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { TitleNotFoundException } from '#shared/domain/exception/academic-offering/title-not-found.exception';

export class EditAcademicProgramHandler implements CommandHandler {
  constructor(
    private readonly academicProgramRepository: AcademicProgramRepository,
    private readonly academicProgramGetter: AcademicProgramGetter,
    private readonly titleGetter: TitleGetter,
  ) {}

  async handle(command: EditAcademicProgramCommand): Promise<void> {
    if (
      await this.academicProgramRepository.existsByCode(
        command.id,
        command.code,
      )
    ) {
      throw new AcademicProgramDuplicatedCodeException();
    }

    const adminUserBusinessUnitsId = command.adminUser.businessUnits.map(
      (bu: BusinessUnit) => bu.id,
    );

    const academicProgram = await this.academicProgramGetter.getByAdminUser(
      command.id,
      adminUserBusinessUnitsId,
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const title = await this.titleGetter.getByAdminUser(
      command.titleId,
      adminUserBusinessUnitsId,
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    if (title.businessUnit.id !== academicProgram.businessUnit.id) {
      throw new TitleNotFoundException();
    }

    academicProgram.update(
      command.name,
      command.code,
      title,
      command.adminUser,
    );

    await this.academicProgramRepository.save(academicProgram);
  }
}
