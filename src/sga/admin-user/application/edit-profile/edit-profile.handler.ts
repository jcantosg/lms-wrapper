import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { EditProfileCommand } from '#admin-user/application/edit-profile/edit-profile.command';

export class EditProfileHandler implements CommandHandler {
  constructor(
    private readonly repository: AdminUserRepository,
    private readonly imageUploader: ImageUploader,
  ) {}

  async handle(command: EditProfileCommand): Promise<void> {
    const avatarUrl = command.avatar
      ? await this.imageUploader.uploadImage(
          command.avatar,
          command.name,
          'admin-user-avatar',
        )
      : '';
    const userToUpdate = command.adminUser;
    userToUpdate.update(
      command.name,
      command.surname,
      command.surname2 ?? null,
      userToUpdate.identityDocument,
      userToUpdate.roles,
      avatarUrl,
    );
    await this.repository.save(userToUpdate);
  }
}