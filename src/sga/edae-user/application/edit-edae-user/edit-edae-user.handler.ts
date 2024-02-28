import { CommandHandler } from '#shared/domain/bus/command.handler';
import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { EditEdaeUserCommand } from '#edae-user/application/edit-edae-user/edit-edae-user.command';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { IdentityDocument } from '#/sga/shared/domain/value-object/identity-document';
import { EdaeUserBusinessUnitChecker } from '#edae-user/domain/service/edae-user-business-unitChecker.service';

export class EditEdaeUserHandler implements CommandHandler {
  constructor(
    private readonly repository: EdaeUserRepository,
    private readonly edaeUserGetter: EdaeUserGetter,
    private readonly imageUploader: ImageUploader,
    private readonly countryGetter: CountryGetter,
    private readonly edaeUserBusinessUnitChecker: EdaeUserBusinessUnitChecker,
  ) {}

  async handle(command: EditEdaeUserCommand): Promise<void> {
    const edaeUser = await this.edaeUserGetter.get(command.id);
    this.edaeUserBusinessUnitChecker.checkBusinessUnits(
      command.adminUser,
      edaeUser,
    );
    const location = await this.countryGetter.get(command.location);
    const newAvatar = command.avatar
      ? await this.imageUploader.uploadImage(
          command.avatar,
          command.name,
          'edae-user-avatars',
        )
      : edaeUser.avatar;
    edaeUser.update(
      command.name,
      command.surname1,
      command.surname2,
      new IdentityDocument(command.identityDocument),
      command.roles,
      command.timeZone,
      command.isRemote,
      location,
      newAvatar,
    );

    await this.repository.save(edaeUser);
  }
}
