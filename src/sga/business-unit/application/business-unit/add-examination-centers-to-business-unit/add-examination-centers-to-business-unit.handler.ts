import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AddExaminationCentersToBusinessUnitCommand } from '#business-unit/application/business-unit/add-examination-centers-to-business-unit/add-examination-centers-to-business-unit.command';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';

export class AddExaminationCentersToBusinessUnitHandler
  implements CommandHandler
{
  constructor(
    private readonly businessUnitRepository: BusinessUnitRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly examinationCenterGetter: ExaminationCenterGetter,
  ) {}

  async handle(
    command: AddExaminationCentersToBusinessUnitCommand,
  ): Promise<void> {
    const businessUnit = await this.businessUnitGetter.get(command.id);
    const adminUserBusinessUnits = command.user.businessUnits.map(
      (bu) => bu.id,
    );

    if (!adminUserBusinessUnits.includes(businessUnit.id)) {
      throw new BusinessUnitNotFoundException();
    }

    const examinationCenters = await Promise.all(
      command.examinationCenters.map(
        async (examinationCenterId: string) =>
          await this.examinationCenterGetter.get(examinationCenterId),
      ),
    );

    examinationCenters.forEach((examinationCenter) => {
      businessUnit.addExaminationCenter(examinationCenter);
    });

    await this.businessUnitRepository.update(businessUnit);
  }
}
