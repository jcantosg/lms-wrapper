import { CommandHandler } from '#shared/domain/bus/command.handler';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { RemoveBusinessUnitFromExaminationCenterCommand } from '#business-unit/application/examination-center/remove-business-unit-from-examination-center/remove-business-unit-from-examination-center.command';

export class RemoveBusinessUnitFromExaminationCenterHandler
  implements CommandHandler
{
  constructor(
    private readonly examinationCenterRepository: ExaminationCenterRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly examinationCenterGetter: ExaminationCenterGetter,
  ) {}

  async handle(
    command: RemoveBusinessUnitFromExaminationCenterCommand,
  ): Promise<void> {
    const examinationCenter = await this.examinationCenterGetter.get(
      command.id,
    );
    const adminUserBusinessUnits = command.user.businessUnits.map(
      (bu) => bu.id,
    );

    const businessUnit = await this.businessUnitGetter.get(
      command.businessUnit,
    );

    if (!adminUserBusinessUnits.includes(command.businessUnit)) {
      throw new BusinessUnitNotFoundException();
    }

    examinationCenter.removeBusinessUnit(businessUnit);

    await this.examinationCenterRepository.update(examinationCenter);
  }
}
