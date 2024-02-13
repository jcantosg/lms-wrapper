import { RegisterAdminUserCommand } from '#admin-user/application/register-admin-user/register-admin-user.command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AdminUserDuplicatedException } from '#shared/domain/exception/admin-user/admin-user-duplicated.exception';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { IdentityDocument } from '#/sga/shared/domain/value-object/identity-document';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { AdminUserCreatedEvent } from '#admin-user/domain/event/admin-user-created.event';
import { AdminUserPasswordGenerator } from '#admin-user/domain/service/admin-user-password-generator.service';
import { AdminUserRolesChecker } from '#admin-user/domain/service/admin-user-roles-checker.service';

export class RegisterAdminUserHandler implements CommandHandler {
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly imageUploader: ImageUploader,
    private readonly eventDispatcher: EventDispatcher,
    private readonly passwordGenerator: AdminUserPasswordGenerator,
    private readonly adminUserRolesChecker: AdminUserRolesChecker,
  ) {}

  async handle(command: RegisterAdminUserCommand): Promise<void> {
    const adminUserBusinessUnits = command.user.businessUnits.map(
      (bu) => bu.id,
    );

    if (
      (await this.adminUserRepository.exists(command.id)) ||
      (await this.adminUserRepository.existsByEmail(command.email))
    ) {
      throw new AdminUserDuplicatedException();
    }
    this.adminUserRolesChecker.checkRoles(command.user.roles, command.roles);

    const businessUnits = await Promise.all(
      command.businessUnits.map(async (businessUnitId: string) => {
        return await this.businessUnitGetter.getByAdminUser(
          businessUnitId,
          adminUserBusinessUnits,
        );
      }),
    );
    const avatarUrl = command.avatar
      ? await this.imageUploader.uploadImage(
          command.avatar,
          command.name,
          'admin-user-avatar',
        )
      : '';
    const identityDocument = new IdentityDocument(command.identityDocument);

    const adminUser: AdminUser = AdminUser.create(
      command.id,
      command.email,
      this.passwordGenerator.generatePassword(),
      command.roles,
      command.name,
      avatarUrl,
      businessUnits,
      command.surname,
      command.surname2,
      identityDocument,
    );
    await this.adminUserRepository.save(adminUser);

    await this.eventDispatcher.dispatch(
      new AdminUserCreatedEvent(
        adminUser.id,
        adminUser.email,
        adminUser.password,
      ),
    );
  }
}
