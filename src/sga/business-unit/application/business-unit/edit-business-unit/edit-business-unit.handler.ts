import { CommandHandler } from '#shared/domain/bus/command.handler';
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { EditBusinessUnitCommand } from '#business-unit/application/business-unit/edit-business-unit/edit-business-unit.command';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { BusinessUnitDuplicatedException } from '#shared/domain/exception/business-unit/business-unit/business-unit-duplicated.exception';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';
import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';

export class EditBusinessUnitHandler implements CommandHandler {
  constructor(
    private readonly businessUnitRepository: BusinessUnitRepository,
    private readonly virtualCampusRepository: VirtualCampusRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
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
    const adminUserBusinessUnits = command.user.businessUnits.map(
      (bu) => bu.id,
    );

    if (!adminUserBusinessUnits.includes(businessUnit.id)) {
      throw new BusinessUnitNotFoundException();
    }

    businessUnit.update(
      command.name,
      command.code,
      country,
      command.user,
      command.isActive,
      businessUnit.examinationCenters,
    );

    await this.businessUnitRepository.update(businessUnit);

    await Promise.all(
      businessUnit.virtualCampuses.map(async (vc) => {
        const virtualCampus = await this.virtualCampusRepository.get(vc.id);
        command.isActive
          ? virtualCampus?.activate()
          : virtualCampus?.deactivate();

        return await this.virtualCampusRepository.update(virtualCampus!);
      }),
    );
  }
}
