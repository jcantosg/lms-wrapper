import { CommandHandler } from '#shared/domain/bus/command.handler';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { DeleteExaminationCenterCommand } from '#business-unit/application/examination-center/delete-examination-center/delete-examination-center.command';
import { ExaminationCenterMainException } from '#shared/domain/exception/business-unit/examination-center-main.exception';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit-not-found.exception';

export class DeleteExaminationCenterHandler implements CommandHandler {
  constructor(
    private examinationCenterRepository: ExaminationCenterRepository,
    private examinationCenterGetter: ExaminationCenterGetter,
  ) {}

  async handle(command: DeleteExaminationCenterCommand): Promise<void> {
    const examinationCenter = await this.examinationCenterGetter.get(
      command.id,
    );
    if (examinationCenter.mainBusinessUnit) {
      throw new ExaminationCenterMainException();
    }

    if (
      examinationCenter.businessUnits.length > 0 &&
      !examinationCenter.businessUnits.find((bu) =>
        command.adminUserBusinessUnits.includes(bu.id),
      )
    ) {
      throw new BusinessUnitNotFoundException();
    }
    await this.examinationCenterRepository.delete(examinationCenter.id);
  }
}
