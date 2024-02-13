import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { AdminUserRolesChecker } from '#admin-user/domain/service/admin-user-roles-checker.service';
import { DeleteAdminUserCommand } from '#admin-user/application/delete-admin-user/delete-admin-user.command';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { AdminUserBusinessUnitsChecker } from '#admin-user/domain/service/admin-user-business-units.checker.service';

export class DeleteAdminUserHandler implements CommandHandler {
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly adminUserGetter: AdminUserGetter,
    private readonly adminUserRolesChecker: AdminUserRolesChecker,
    private readonly adminUserBusinessUnitsChecker: AdminUserBusinessUnitsChecker,
  ) {}

  async handle(command: DeleteAdminUserCommand): Promise<void> {
    const userToDelete = await this.adminUserGetter.get(command.userId);
    this.adminUserRolesChecker.checkRoles(
      command.user.roles,
      userToDelete.roles,
    );
    this.adminUserBusinessUnitsChecker.checkBusinessUnits(
      command.user,
      userToDelete,
    );

    userToDelete.delete();
    await this.adminUserRepository.save(userToDelete);
  }
}
