import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { EdaeUserNotFoundException } from '#shared/domain/exception/edae-user/edae-user-not-found.exception';
import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AddTeacherToInternalGroupCommand } from '#student/application/add-teacher-to-internal-group/add-teacher-to-internal-group.command';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { InternalGroupGetter } from '#student/domain/service/internal-group.getter.service';

export class AddTeacherToInternalGroupHandler implements CommandHandler {
  constructor(
    private readonly internalGroupRepository: InternalGroupRepository,
    private readonly internalGroupGetter: InternalGroupGetter,
    private readonly edaeUserGetter: EdaeUserGetter,
  ) {}

  async handle(command: AddTeacherToInternalGroupCommand) {
    const internalGroup: InternalGroup =
      await this.internalGroupGetter.getByAdminUser(
        command.internalGroupId,
        command.adminUser,
      );

    for (const edaeUserId of command.edaeUserIds) {
      const edaeUser = await this.edaeUserGetter.getByAdminUser(
        edaeUserId,
        command.adminUser.businessUnits.map((bu) => bu.id),
        command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
      );

      if (
        !edaeUser.businessUnits
          .map((bu) => bu.id)
          .includes(internalGroup.businessUnit.id)
      ) {
        throw new EdaeUserNotFoundException();
      }

      internalGroup.addTeachers([edaeUser]);
      await this.internalGroupRepository.save(internalGroup);
    }
  }
}
