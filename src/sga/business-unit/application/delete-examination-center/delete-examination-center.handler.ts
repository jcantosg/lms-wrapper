import { CommandHandler } from '#shared/domain/bus/command.handler';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { DeleteExaminationCenterCommand } from '#business-unit/application/delete-examination-center/delete-examination-center.command';
import { ExaminationCenterMainException } from '#shared/domain/exception/business-unit/examination-center-main.exception';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';

export class DeleteExaminationCenterHandler implements CommandHandler {
  constructor(
    private examinationCenterRepository: ExaminationCenterRepository,
    private examinationCenterGetter: ExaminationCenterGetter,
  ) {}

  async handle(command: DeleteExaminationCenterCommand): Promise<void> {
    const examinationCenter = await this.examinationCenterGetter.get(
      command.id,
    );
    if (examinationCenter.isMain) {
      throw new ExaminationCenterMainException();
    }
    await this.examinationCenterRepository.delete(examinationCenter.id);
  }
}
