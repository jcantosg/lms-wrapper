import { CommandHandler } from '#shared/domain/bus/command.handler';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit-not-found.exception';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { AddBusinessUnitsToExaminationCenterCommand } from '#business-unit/application/add-business-units-to-examination-center/add-business-units-to-examination-center.command';

export class AddBusinessUnitsToExaminationCenterHandler
  implements CommandHandler
{
  constructor(
    private readonly examinationCenterRepository: ExaminationCenterRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly examinationCenterGetter: ExaminationCenterGetter,
  ) {}

  async handle(
    command: AddBusinessUnitsToExaminationCenterCommand,
  ): Promise<void> {
    const examinationCenter = await this.examinationCenterGetter.get(
      command.id,
    );
    const adminUserBusinessUnits = command.user.businessUnits.map(
      (bu) => bu.id,
    );

    const businessUnits = await Promise.all(
      command.businessUnits.map(
        async (businessUnitId: string) =>
          await this.businessUnitGetter.get(businessUnitId),
      ),
    );

    command.businessUnits.forEach((businessUnitId) => {
      if (!adminUserBusinessUnits.includes(businessUnitId)) {
        throw new BusinessUnitNotFoundException();
      }
    });

    businessUnits.forEach((bu) => {
      examinationCenter.addBusinessUnit(bu);
    });

    await this.examinationCenterRepository.update(examinationCenter);
  }
}
