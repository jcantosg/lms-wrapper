import { AdministrativeGroupGetter } from '#student/domain/service/administrative-group.getter.service';
import { AddEdaeUserToAdministrativeGroupCommand } from '#student/application/administrative-group/add-teacher-to-administrative-group/add-edae-user-to-administrative-group.command';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { EdaeUserNotFoundException } from '#shared/domain/exception/edae-user/edae-user-not-found.exception';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { CommandHandler } from '#shared/domain/bus/command.handler';

export class AddEdaeUserToAdministrativeGroupHandler implements CommandHandler {
  constructor(
    private readonly administrativeGroupRepository: AdministrativeGroupRepository,
    private readonly administrativeGroupGetter: AdministrativeGroupGetter,
    private readonly edaeUserGetter: EdaeUserGetter,
  ) {}

  async handle(command: AddEdaeUserToAdministrativeGroupCommand) {
    const administrativeGroup =
      await this.administrativeGroupGetter.getByAdminUser(
        command.administrativeGroupId,
        command.adminUser,
      );

    const edaeUsersToAdd = await Promise.all(
      command.edaeUserIds.map(
        async (edaeUserId: string) =>
          await this.edaeUserGetter.getByAdminUser(
            edaeUserId,
            command.adminUser.businessUnits.map((bu) => bu.id),
            command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
          ),
      ),
    );

    edaeUsersToAdd.forEach((edaeUser) => {
      const edaeUsersBusinessUnits = edaeUser.businessUnits.map((bu) => bu.id);
      if (
        !edaeUsersBusinessUnits.includes(administrativeGroup.businessUnit.id)
      ) {
        throw new EdaeUserNotFoundException();
      }

      administrativeGroup.addTeacher(edaeUser);
    });

    await this.administrativeGroupRepository.save(administrativeGroup);
  }
}
