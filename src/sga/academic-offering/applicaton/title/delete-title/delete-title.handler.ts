import { DeleteTitleCommand } from './delete-title.command';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { TitleGetter } from '#academic-offering/domain/service/title/title-getter.service';
import { CommandHandler } from '#shared/domain/bus/command.handler';

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
    /*@TODO check if has academic programs */

    await this.repository.delete(title);
  }
}
