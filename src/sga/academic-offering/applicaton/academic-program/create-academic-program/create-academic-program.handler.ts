import { CommandHandler } from '#shared/domain/bus/command.handler';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { AcademicProgramDuplicatedException } from '#shared/domain/exception/academic-offering/academic-program.duplicated.exception';
import { AcademicProgramDuplicatedCodeException } from '#shared/domain/exception/academic-offering/academic-program.duplicated-code.exception';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { TitleGetter } from '#academic-offering/domain/service/title/title-getter.service';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { CreateAcademicProgramCommand } from '#academic-offering/applicaton/academic-program/create-academic-program/create-academic-program.command';
import { ProgramBlockDuplicatedException } from '#shared/domain/exception/academic-offering/program-block.duplicated.exception';
import { getBlockPrefix } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';

export class CreateAcademicProgramHandler implements CommandHandler {
  constructor(
    private readonly academicProgramRepository: AcademicProgramRepository,
    private readonly programBlockRepository: ProgramBlockRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly titleGetter: TitleGetter,
  ) {}

  async handle(command: CreateAcademicProgramCommand): Promise<void> {
    if (await this.academicProgramRepository.existsById(command.id)) {
      throw new AcademicProgramDuplicatedException();
    }
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

    const businessUnit = await this.businessUnitGetter.getByAdminUser(
      command.businessUnitId,
      adminUserBusinessUnitsId,
    );

    const title = await this.titleGetter.getByAdminUser(
      command.titleId,
      adminUserBusinessUnitsId,
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const academicProgram = AcademicProgram.create(
      command.id,
      command.name,
      command.code,
      title,
      businessUnit,
      command.adminUser,
      command.structureType,
    );

    academicProgram.programBlocks = await this.createProgramBlocks(
      command,
      academicProgram,
    );
    await this.academicProgramRepository.save(academicProgram);
  }

  private async createProgramBlocks(
    command: CreateAcademicProgramCommand,
    academicProgram: AcademicProgram,
  ) {
    const uniqueBlocksIds = new Set(command.programBlocks);
    if (uniqueBlocksIds.size !== command.programBlocks.length) {
      throw new ProgramBlockDuplicatedException();
    }

    const blockPrefix = getBlockPrefix(command.structureType);
    const programBlocksToAdd: ProgramBlock[] = [];

    for (const [index, block] of command.programBlocks.entries()) {
      if (await this.programBlockRepository.existsById(block)) {
        throw new ProgramBlockDuplicatedException();
      }

      const programBlock = ProgramBlock.create(
        block,
        `${blockPrefix} ${index + 1}`,
        academicProgram,
        command.adminUser,
      );
      programBlocksToAdd.push(programBlock);
    }

    return programBlocksToAdd;
  }
}
