import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { CommandHandler } from '#shared/domain/bus/command.handler';
import { EditExaminationCenterCommand } from '#business-unit/application/edit-examination-center/edit-examination-center.command';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { ExaminationCenterDuplicatedCodeException } from '#shared/domain/exception/business-unit/examination-center-duplicated-code.exception';
import { ExaminationCenterDuplicatedNameException } from '#shared/domain/exception/business-unit/examination-center-duplicated-name.exception';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit-not-found.exception';
import { CountryGetter } from '#shared/domain/service/country-getter.service';

export class EditExaminationCenterHandler implements CommandHandler {
  constructor(
    private readonly examinationCenterRepository: ExaminationCenterRepository,
    private readonly examinationCenterGetter: ExaminationCenterGetter,
    private readonly countryGetter: CountryGetter,
  ) {}

  async handle(command: EditExaminationCenterCommand): Promise<void> {
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
    const examinationCenter = await this.examinationCenterGetter.get(
      command.id,
    );
    const adminUserBusinessUnits = command.user.businessUnits.map(
      (bu) => bu.id,
    );
    const examinationCenterBusinessUnits = examinationCenter.businessUnits.map(
      (businessUnit: BusinessUnit) => businessUnit.id,
    );
    examinationCenterBusinessUnits.forEach((id: string) => {
      if (!adminUserBusinessUnits.includes(id)) {
        throw new BusinessUnitNotFoundException();
      }
    });

    const country = await this.countryGetter.get(command.countryId);

    examinationCenter.update(
      command.name,
      command.code,
      command.address,
      command.user,
      command.isActive,
      country,
    );

    await this.examinationCenterRepository.update(examinationCenter);
  }
}
