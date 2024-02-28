import { CommandHandler } from '#shared/domain/bus/command.handler';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';
import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';
import { AddBusinessUnitsToEdaeUserCommand } from '#edae-user/application/add-business-units-to-edae-user/add-business-units-to-edae-user.command';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';

export class AddBusinessUnitsToEdaeUserHandler implements CommandHandler {
  constructor(
    private readonly edaeUserRepository: EdaeUserRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly edaeUserGetter: EdaeUserGetter,
  ) {}

  async handle(command: AddBusinessUnitsToEdaeUserCommand): Promise<void> {
    const edaeUser = await this.edaeUserGetter.get(command.id);
    const adminUserBusinessUnits = command.user.businessUnits.map(
      (bu) => bu.id,
    );

    edaeUser.businessUnits.forEach((businessUnit) => {
      if (!adminUserBusinessUnits.includes(businessUnit.id)) {
        throw new BusinessUnitNotFoundException();
      }
    });

    const businessUnits = await Promise.all(
      command.businessUnits.map(
        async (businessUnitId: string) =>
          await this.businessUnitGetter.getByAdminUser(
            businessUnitId,
            adminUserBusinessUnits,
          ),
      ),
    );

    businessUnits.forEach((bu) => {
      edaeUser.addBusinessUnit(bu);
    });

    await this.edaeUserRepository.update(edaeUser);
  }
}
