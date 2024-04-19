import { DeleteTitleCommand } from './delete-title.command';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { TitleGetter } from '#academic-offering/domain/service/title/title-getter.service';
import { CommandHandler } from '#shared/domain/bus/command.handler';
import { TitleHasAcademicProgramsException } from '#shared/domain/exception/academic-offering/title-has-academic-programs.exception';

export class DeleteTitleHandler implements CommandHandler {
  constructor(
    private readonly repository: TitleRepository,
    private titleGetter: TitleGetter,
  ) {}

  async handle(command: DeleteTitleCommand): Promise<void> {
    const title = await this.titleGetter.getByAdminUser(
      command.id,
      command.adminUserBusinessUnits,
      command.isSuperAdmin,
    );
    if (title.hasAcademicPrograms()) {
      throw new TitleHasAcademicProgramsException();
    }

    await this.repository.delete(title);
  }
}
