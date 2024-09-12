import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';
import { EditAdministrativeProcessCommand } from '#student/application/administrative-process/edit-administrative-process/edit-administrative-process.command';
import { AdministrativeProcessNotFoundException } from '#shared/domain/exception/student-360/administrative-process.not-found.exception';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';
import { AdministrativeProcessStatusEnum } from '#student/domain/enum/administrative-process-status.enum';

export class EditAdministrativeProcessHandler implements CommandHandler {
  constructor(
    private readonly administrativeProcessRepository: AdministrativeProcessRepository,
  ) {}

  async handle(command: EditAdministrativeProcessCommand) {
    const administrativeProcess =
      await this.administrativeProcessRepository.get(command.id);

    if (!administrativeProcess) {
      throw new AdministrativeProcessNotFoundException();
    }

    administrativeProcess.update(command.status);
    await this.administrativeProcessRepository.save(administrativeProcess);

    const studentAdminProcesses =
      await this.administrativeProcessRepository.getByStudent(
        administrativeProcess.student!.id,
      );

    const academicRecordProcesses = studentAdminProcesses.filter(
      (ap) => ap.type === AdministrativeProcessTypeEnum.NEW_ACADEMIC_RECORD,
    );

    for (const academicRecordProcess of academicRecordProcesses) {
      if (
        studentAdminProcesses.find(
          (ap) =>
            ap.type === AdministrativeProcessTypeEnum.IDENTITY_DOCUMENTS &&
            ap.status === AdministrativeProcessStatusEnum.VALIDATED,
        ) &&
        (studentAdminProcesses.find(
          (ap) =>
            ap.type === AdministrativeProcessTypeEnum.ACCESS_DOCUMENTS &&
            ap.status === AdministrativeProcessStatusEnum.VALIDATED &&
            ap.academicRecord!.id === academicRecordProcess.academicRecord!.id,
        ) ||
          studentAdminProcesses.find(
            (ap) =>
              ap.type === AdministrativeProcessTypeEnum.ACADEMIC_RECOGNITION &&
              ap.status === AdministrativeProcessStatusEnum.VALIDATED &&
              ap.academicRecord!.id ===
                academicRecordProcess.academicRecord!.id,
          ))
      ) {
        academicRecordProcess.update(AdministrativeProcessStatusEnum.VALIDATED);
        await this.administrativeProcessRepository.save(academicRecordProcess);
      } else {
        academicRecordProcess.update(
          AdministrativeProcessStatusEnum.PENDING_DOCUMENTS,
        );
        await this.administrativeProcessRepository.save(academicRecordProcess);
      }
    }
  }
}
