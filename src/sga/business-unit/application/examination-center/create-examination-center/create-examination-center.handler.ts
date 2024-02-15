import { CommandHandler } from '#shared/domain/bus/command.handler';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { CreateExaminationCenterCommand } from '#business-unit/application/examination-center/create-examination-center/create-examination-center.command';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { ExaminationCenterDuplicatedNameException } from '#shared/domain/exception/business-unit/examination-center/examination-center-duplicated-name.exception';
import { ExaminationCenterDuplicatedCodeException } from '#shared/domain/exception/business-unit/examination-center/examination-center-duplicated-code.exception';
import { ExaminationCenterDuplicatedException } from '#shared/domain/exception/business-unit/examination-center/examination-center-duplicated.exception';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';

export class CreateExaminationCenterHandler implements CommandHandler {
  constructor(
    private readonly examinationCenterRepository: ExaminationCenterRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly countryGetter: CountryGetter,
  ) {}

  async handle(command: CreateExaminationCenterCommand): Promise<void> {
    if (
      await this.examinationCenterRepository.existsByName(
        command.id,
        command.name,
      )
    ) {
      throw new ExaminationCenterDuplicatedNameException();
    }
    if (
      await this.examinationCenterRepository.existsByCode(
        command.id,
        command.code,
      )
    ) {
      throw new ExaminationCenterDuplicatedCodeException();
    }
    if (await this.examinationCenterRepository.existsById(command.id)) {
      throw new ExaminationCenterDuplicatedException();
    }
    const adminUserBusinessUnits = command.user.businessUnits.map(
      (bu) => bu.id,
    );
    const businessUnits = await Promise.all(
      command.businessUnits.map(async (businessUnitId: string) => {
        return await this.businessUnitGetter.get(businessUnitId);
      }),
    );

    if (
      businessUnits.length > 0 &&
      !businessUnits.find((bu) => adminUserBusinessUnits.includes(bu.id))
    ) {
      throw new BusinessUnitNotFoundException();
    }

    const country = await this.countryGetter.get(command.countryId);

    const examinationCenter = ExaminationCenter.create(
      command.id,
      command.name,
      command.code,
      businessUnits,
      command.address,
      command.user,
      country,
    );
    await this.examinationCenterRepository.save(examinationCenter);
  }
}
