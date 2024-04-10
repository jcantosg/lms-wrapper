import { CommandHandler } from '#shared/domain/bus/command.handler';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { CreateProgramBlockCommand } from '#academic-offering/applicaton/program-block/create-program-block/create-program-block.command';
import { ProgramBlockDuplicatedException } from '#shared/domain/exception/academic-offering/program-block.duplicated.exception';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { getBlockPrefix } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';

export class CreateProgramBlockHandler implements CommandHandler {
  constructor(
    private programBlockRepository: ProgramBlockRepository,
    private academicProgramGetter: AcademicProgramGetter,
  ) {}

  async handle(command: CreateProgramBlockCommand): Promise<void> {
    const academicProgram = await this.academicProgramGetter.getByAdminUser(
      command.academicProgramId,
      command.adminUser.businessUnits.map((bu) => bu.id),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const uniqueBlocksIds = new Set(command.blocks);
    if (uniqueBlocksIds.size !== command.blocks.length) {
      throw new ProgramBlockDuplicatedException();
    }

    const blockPrefix = getBlockPrefix(command.structureType);

    const programBlocksToAdd: ProgramBlock[] = [];

    for (const [index, block] of command.blocks.entries()) {
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

    await this.programBlockRepository.save(programBlocksToAdd);
  }
}
