import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { AdminUserRolesChecker } from '#admin-user/domain/service/admin-user-roles-checker.service';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { RemoveBusinessUnitFromAdminUserCommand } from '#admin-user/application/remove-business-unit-from-admin-user/remove-business-unit-from-admin-user.command';

export class RemoveBusinessUnitFromAdminUserHandler implements CommandHandler {
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly adminUserGetterService: AdminUserGetter,
    private readonly adminUserRolesChecker: AdminUserRolesChecker,
    private readonly businessUnitGetter: BusinessUnitGetter,
  ) {}
  async handle(command: RemoveBusinessUnitFromAdminUserCommand): Promise<void> {
    const adminUserBusinessUnits = command.user.businessUnits.map(
      (bu) => bu.id,
    );
    const userToEdit = await this.adminUserGetterService.getByAdminUser(
      command.id,
      adminUserBusinessUnits,
    );
    this.adminUserRolesChecker.checkRoles(command.user.roles, userToEdit.roles);

    const businessUnitToRemove = await this.businessUnitGetter.getByAdminUser(
      command.businessUnit,
      adminUserBusinessUnits,
    );

    userToEdit.removeBusinessUnit(businessUnitToRemove);
    await this.adminUserRepository.save(userToEdit);
  }
}
