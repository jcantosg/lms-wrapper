import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { CreateBusinessUnitCommand } from '#business-unit/application/create-business-unit/create-business-unit.command';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { CommandHandler } from '#shared/domain/bus/command.handler';
import { BusinessUnitDuplicatedException } from '#shared/domain/exception/business-unit/business-unit-duplicated.exception';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { v4 as uuid } from 'uuid';
import { Country } from '#shared/domain/entity/country.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { BusinessUnitWrongNameLengthException } from '#shared/domain/exception/business-unit/business-unit-wrong-name-length.exception';

const START_POSITION = 0;
const END_POSITION = 3;

export class CreateBusinessUnitHandler implements CommandHandler {
  constructor(
    private readonly businessUnitRepository: BusinessUnitRepository,
    private readonly adminUserGetter: AdminUserGetter,
    private readonly countryGetter: CountryGetter,
    private readonly virtualCampusRepository: VirtualCampusRepository,
    private readonly examinationCenterRepository: ExaminationCenterRepository,
  ) {}

  async handle(command: CreateBusinessUnitCommand): Promise<void> {
    if (
      (await this.businessUnitRepository.existsById(command.id)) ||
      (await this.businessUnitRepository.existsByName(command.name)) ||
      (await this.businessUnitRepository.existsByCode(command.code))
    ) {
      throw new BusinessUnitDuplicatedException();
    }

    if (command.name.length <= END_POSITION) {
      throw new BusinessUnitWrongNameLengthException();
    }

    const user = await this.adminUserGetter.get(command.userId);
    const country = await this.countryGetter.get(command.countryId);

    const businessUnit = await this.createBusinessUnit(
      command.id,
      command.name,
      command.code,
      country,
      user,
    );
    await this.createVirtualCampus(businessUnit, user);
    await this.createExaminationCenter(businessUnit, user);
  }

  private async createBusinessUnit(
    id: string,
    name: string,
    code: string,
    country: Country,
    user: AdminUser,
  ): Promise<BusinessUnit> {
    const businessUnit = BusinessUnit.create(id, name, code, country, user);
    await this.businessUnitRepository.save(businessUnit);

    return businessUnit;
  }

  private async createVirtualCampus(
    businessUnit: BusinessUnit,
    user: AdminUser,
  ): Promise<VirtualCampus> {
    const virtualCampus = VirtualCampus.createFromBusinessUnit(
      uuid(),
      businessUnit,
      user,
    );
    await this.virtualCampusRepository.save(virtualCampus);

    return virtualCampus;
  }

  private async createExaminationCenter(
    businessUnit: BusinessUnit,
    user: AdminUser,
  ): Promise<void> {
    let code = businessUnit.name
      .substring(START_POSITION, END_POSITION)
      .toUpperCase();

    code = await this.examinationCenterRepository.getNextAvailableCode(code);

    const examinationCenter = ExaminationCenter.createFromBusinessUnit(
      uuid(),
      businessUnit,
      user,
      code,
    );
    await this.examinationCenterRepository.save(examinationCenter);
  }
}
