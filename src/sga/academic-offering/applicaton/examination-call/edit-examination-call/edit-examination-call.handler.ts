import { CommandHandler } from '#shared/domain/bus/command.handler';
import { ExaminationCallRepository } from '#academic-offering/domain/repository/examination-call.repository';
import { EditExaminationCallCommand } from '#academic-offering/applicaton/examination-call/edit-examination-call/edit-examination-call.command';
import { ExaminationCall } from '#academic-offering/domain/entity/examination-call.entity';
import { ExaminationCallGetter } from '#academic-offering/domain/service/examination-call/examination-call-getter.service';

export class EditExaminationCallHandler implements CommandHandler {
  constructor(
    private readonly repository: ExaminationCallRepository,
    private readonly examinationCallGetter: ExaminationCallGetter,
  ) {}

  async handle(command: EditExaminationCallCommand): Promise<void> {
    const examinationCall: ExaminationCall =
      await this.examinationCallGetter.getByAdminUser(
        command.id,
        command.adminUserBusinessUnits,
        command.isSuperAdmin,
      );

    examinationCall.name = command.name;
    examinationCall.startDate = command.startDate;
    examinationCall.endDate = command.endDate;

    await this.repository.save(examinationCall);
  }
}
