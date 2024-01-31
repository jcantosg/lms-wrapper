import { CommandHandler } from '#shared/domain/bus/command.handler';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit-not-found.exception';
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { RemoveExaminationCentersFromBusinessUnitCommand } from '#business-unit/application/remove-examination-center-from-business-unit/remove-examination-center-from-business-unit.command';

export class RemoveExaminationCentersFromBusinessUnitHandler
  implements CommandHandler
{
  constructor(
    private readonly businessUnitRepository: BusinessUnitRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly examinationCenterGetter: ExaminationCenterGetter,
  ) {}

  async handle(
    command: RemoveExaminationCentersFromBusinessUnitCommand,
  ): Promise<void> {
    const businessUnit = await this.businessUnitGetter.get(command.id);
    const adminUserBusinessUnits = command.user.businessUnits.map(
      (bu) => bu.id,
    );

    if (!adminUserBusinessUnits.includes(businessUnit.id)) {
      throw new BusinessUnitNotFoundException();
    }

    const examinationCenter = await this.examinationCenterGetter.get(
      command.examinationCenter,
    );

    businessUnit.removeExaminationCenter(examinationCenter);

    await this.businessUnitRepository.update(businessUnit);
  }
}
