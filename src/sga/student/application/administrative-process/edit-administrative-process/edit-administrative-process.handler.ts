import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';
import { EditAdministrativeProcessCommand } from '#student/application/administrative-process/edit-administrative-process/edit-administrative-process.command';
import { AdministrativeProcessNotFoundException } from '#shared/domain/exception/student-360/administrative-process.not-found.exception';

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
  }
}
