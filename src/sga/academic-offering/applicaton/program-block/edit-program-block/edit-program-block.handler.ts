import { CommandHandler } from '#shared/domain/bus/command.handler';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { EditProgramBlockCommand } from '#academic-offering/applicaton/program-block/edit-program-block/edit-program-block.command';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';

export class EditProgramBlockHandler implements CommandHandler {
  constructor(
    private readonly repository: ProgramBlockRepository,
    private programBlockGetter: ProgramBlockGetter,
  ) {}

  public async handle(command: EditProgramBlockCommand): Promise<void> {
    const programBlock = await this.programBlockGetter.getByAdminUser(
      command.id,
      command.adminUser,
    );
    programBlock.update(command.name, command.adminUser);
    await this.repository.save(programBlock);
  }
}
