import { CommandHandler } from '#shared/domain/bus/command.handler';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';
import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';
import { RemoveBusinessUnitsFromEdaeUserCommand } from '#edae-user/application/remove-business-units-from-edae-user/remove-business-units-from-edae-user.command';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';

export class RemoveBusinessUnitsFromEdaeUserHandler implements CommandHandler {
  constructor(
    private readonly edaeUserRepository: EdaeUserRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly edaeUserGetter: EdaeUserGetter,
  ) {}

  async handle(command: RemoveBusinessUnitsFromEdaeUserCommand): Promise<void> {
    const edaeUser = await this.edaeUserGetter.get(command.id);
    const adminUserBusinessUnits = command.user.businessUnits.map(
      (bu) => bu.id,
    );

    let includeSomeBusinessUnits = false;
    edaeUser.businessUnits.forEach((businessUnit) => {
      if (adminUserBusinessUnits.includes(businessUnit.id)) {
        includeSomeBusinessUnits = true;
      }
    });

    if (!includeSomeBusinessUnits) {
      throw new BusinessUnitNotFoundException();
    }

    const businessUnit = await this.businessUnitGetter.getByAdminUser(
      command.businessUnit,
      adminUserBusinessUnits,
    );

    edaeUser.removeBusinessUnit(businessUnit);

    await this.edaeUserRepository.update(edaeUser);
  }
}
