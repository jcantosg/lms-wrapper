import { CommandHandler } from '#shared/domain/bus/command.handler';
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { EditBusinessUnitCommand } from '#business-unit/application/edit-business-unit/edit-business-unit.command';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { BusinessUnitDuplicatedException } from '#shared/domain/exception/business-unit/business-unit-duplicated.exception';

export class EditBusinessUnitHandler implements CommandHandler {
  constructor(
    private readonly businessUnitRepository: BusinessUnitRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly adminUserGetter: AdminUserGetter,
    private readonly countryGetter: CountryGetter,
  ) {}

  async handle(command: EditBusinessUnitCommand): Promise<void> {
    if (
      (await this.businessUnitRepository.existsByName(
        command.id,
        command.name,
      )) ||
      (await this.businessUnitRepository.existsByCode(command.id, command.code))
    ) {
      throw new BusinessUnitDuplicatedException();
    }
    const businessUnit = await this.businessUnitGetter.get(command.id);
    const country = await this.countryGetter.get(command.countryId);
    const user = await this.adminUserGetter.get(command.userId);
    businessUnit.update(
      command.name,
      command.code,
      country,
      user,
      command.isActive,
    );
    await this.businessUnitRepository.update(businessUnit);
  }
}
