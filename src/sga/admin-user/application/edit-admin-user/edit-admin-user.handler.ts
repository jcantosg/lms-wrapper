import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { AdminUserRolesChecker } from '#admin-user/domain/service/admin-user-roles-checker.service';
import { EditAdminUserCommand } from '#admin-user/application/edit-admin-user/edit-admin-user.command';
import { IdentityDocument } from '#/sga/shared/domain/value-object/identity-document';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';

export class EditAdminUserHandler implements CommandHandler {
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly adminUserGetterService: AdminUserGetter,
    private readonly adminUserRolesChecker: AdminUserRolesChecker,
    private readonly imageUploader: ImageUploader,
  ) {}

  async handle(command: EditAdminUserCommand): Promise<void> {
    const adminUserBusinessUnits = command.user.businessUnits.map(
      (bu) => bu.id,
    );

    const userToEdit = await this.adminUserGetterService.getByAdminUser(
      command.id,
      adminUserBusinessUnits,
    );

    this.adminUserRolesChecker.checkRoles(command.user.roles, userToEdit.roles);
    this.adminUserRolesChecker.checkRoles(command.user.roles, command.roles);

    const avatarUrl = command.avatar
      ? await this.imageUploader.uploadImage(
          command.avatar,
          command.name,
          'admin-user-avatar',
        )
      : '';

    const identityDocument = new IdentityDocument(command.identityDocument);

    userToEdit.update(
      command.name,
      command.surname,
      command.surname2,
      identityDocument,
      command.roles,
      avatarUrl,
    );

    await this.adminUserRepository.save(userToEdit);
  }
}
