import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { AdminUserRolesChecker } from '#admin-user/domain/service/admin-user-roles-checker.service';
import { AddBusinessUnitsToAdminUserCommand } from '#admin-user/application/add-business-units-to-admin-user/add-business-units-to-admin-user.command';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';

export class AddBusinessUnitsToAdminUserHandler implements CommandHandler {
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly adminUserGetterService: AdminUserGetter,
    private readonly adminUserRolesChecker: AdminUserRolesChecker,
    private readonly businessUnitGetter: BusinessUnitGetter,
  ) {}
  async handle(command: AddBusinessUnitsToAdminUserCommand): Promise<void> {
    const adminUserBusinessUnits = command.user.businessUnits.map(
      (bu) => bu.id,
    );

    const userToEdit = await this.adminUserGetterService.getByAdminUser(
      command.id,
      adminUserBusinessUnits,
    );
    this.adminUserRolesChecker.checkRoles(command.user.roles, userToEdit.roles);

    const businessUnitsToAdd = await Promise.all(
      command.businessUnits.map(async (businessUnitId: string) => {
        return await this.businessUnitGetter.getByAdminUser(
          businessUnitId,
          adminUserBusinessUnits,
        );
      }),
    );

    businessUnitsToAdd.forEach((bu) => {
      userToEdit.addBusinessUnit(bu);
    });

    await this.adminUserRepository.save(userToEdit);
  }
}
