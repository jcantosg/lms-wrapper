import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { RemoveEdaeUserFromAdministrativeGroupCommand } from '#student/application/administrative-group/remove-edae-user-from-administrative-group/remove-edae-user-from-administrative-group.command';
import { AdministrativeGroupGetter } from '#student/domain/service/administrative-group.getter.service';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';

export class RemoveEdaeUserFromAdministrativeGroupHandler
  implements CommandHandler
{
  constructor(
    private repository: AdministrativeGroupRepository,
    private readonly administrativeGroupGetter: AdministrativeGroupGetter,
    private readonly edaeUserGetter: EdaeUserGetter,
  ) {}

  async handle(
    command: RemoveEdaeUserFromAdministrativeGroupCommand,
  ): Promise<void> {
    const administrativeGroup =
      await this.administrativeGroupGetter.getByAdminUser(
        command.administrativeGroupId,
        command.adminUser,
      );

    const edaeUserToRemove = await this.edaeUserGetter.get(command.edaeUserId);

    administrativeGroup.removeTeacher(edaeUserToRemove);

    await this.repository.save(administrativeGroup);
  }
}
