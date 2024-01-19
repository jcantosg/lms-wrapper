import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { CommandHandler } from '#shared/domain/bus/command.handler';
import { EditExaminationCenterCommand } from '#business-unit/application/edit-examination-center/edit-examination-center.command';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { ExaminationCenterDuplicatedCodeException } from '#shared/domain/exception/business-unit/examination-center-duplicated-code.exception';

export class EditExaminationCenterHandler implements CommandHandler {
  constructor(
    private readonly examinationCenterRepository: ExaminationCenterRepository,
    private readonly examinationCenterGetter: ExaminationCenterGetter,
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly adminUserGetter: AdminUserGetter,
  ) {}

  async handle(command: EditExaminationCenterCommand): Promise<void> {
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
    const user = await this.adminUserGetter.get(command.userId);

    const businessUnits = await Promise.all(
      command.businessUnits.map(async (businessUnitId: string) => {
        return await this.businessUnitGetter.get(businessUnitId);
      }),
    );

    examinationCenter.update(
      command.name,
      command.code,
      command.address,
      businessUnits,
      user,
      command.isActive,
    );

    await this.examinationCenterRepository.update(examinationCenter);
  }
}
