import { CommandHandler } from '#shared/domain/bus/command.handler';
import { CreateEdaeUserCommand } from './create-edae-user.command';
import { EdaeUserDuplicatedException } from '#shared/domain/exception/edae-user/edae-user-duplicated.exception';
import { IdentityDocument } from '#/sga/shared/domain/value-object/identity-document';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { EdaeUserRepository } from '#/sga/edae-user/domain/repository/edae-user.repository';
import { EdaeUser } from '#/sga/edae-user/domain/entity/edae-user.entity';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';

export class CreateEdaeUserHandler implements CommandHandler {
  constructor(
    private readonly edaeUserRepository: EdaeUserRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly countryGetter: CountryGetter,
    private readonly imageUploader: ImageUploader,
  ) {}

  async handle(command: CreateEdaeUserCommand): Promise<void> {
    const idExists = await this.edaeUserRepository.existsById(command.id);
    const emailExists = await this.edaeUserRepository.existsByEmail(
      command.email,
    );

    if (idExists || emailExists) {
      throw new EdaeUserDuplicatedException();
    }
    const identityDocument = new IdentityDocument(command.identityDocument);

    const businessUnits = await Promise.all(
      command.businessUnits.map(async (businessUnitId: string) => {
        return await this.businessUnitGetter.getByAdminUser(
          businessUnitId,
          command.adminUserBusinessUnits,
        );
      }),
    );

    const avatar = command.avatar
      ? await this.imageUploader.uploadImage(
          command.avatar,
          command.name,
          'edae-user-avatar',
        )
      : null;

    const location = await this.countryGetter.get(command.location);

    const edaeUser = EdaeUser.create(
      command.id,
      command.name,
      command.surname1,
      command.surname2,
      command.email,
      identityDocument,
      command.roles,
      businessUnits,
      command.timeZone,
      command.isRemote,
      location,
      avatar,
    );
    await this.edaeUserRepository.save(edaeUser);
  }
}
