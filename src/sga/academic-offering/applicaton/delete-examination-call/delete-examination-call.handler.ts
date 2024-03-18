import { CommandHandler } from '#shared/domain/bus/command.handler';
import { ExaminationCallRepository } from '#academic-offering/domain/repository/examination-call.repository';
import { DeleteExaminationCallCommand } from '#academic-offering/applicaton/delete-examination-call/delete-examination-call.command';
import { ExaminationCallGetter } from '#academic-offering/domain/service/examination-call-getter.service';

export class DeleteExaminationCallHandler implements CommandHandler {
  constructor(
    private readonly repository: ExaminationCallRepository,
    private examinationCallGetter: ExaminationCallGetter,
  ) {}

  async handle(command: DeleteExaminationCallCommand): Promise<void> {
    const examinationCall = await this.examinationCallGetter.getByAdminUser(
      command.id,
      command.adminUserBusinessUnits,
      command.isSuperAdmin,
    );
    /*@TODO check if has students */

    await this.repository.delete(examinationCall);
  }
}
