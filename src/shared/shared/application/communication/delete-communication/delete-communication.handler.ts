import { CommandHandler } from '#shared/domain/bus/command.handler';
import { CommunicationRepository } from '#shared/domain/repository/communication.repository';
import { CommunicationStatus } from '#shared/domain/enum/communication-status.enum';
import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';
import { CommunicationNotFoundException } from '#shared/domain/exception/communication/communication.not-found.exception';
import { DeleteCommunicationCommand } from '#shared/application/communication/delete-communication/delete-communication.command';
import { CommunicationAlreadySentException } from '#shared/domain/exception/communication/communication.already-sent.exception';

export class DeleteCommunicationHandler implements CommandHandler {
  constructor(
    private readonly repository: CommunicationRepository,
    private readonly communicationStudentRepository: CommunicationStudentRepository,
  ) {}

  async handle(command: DeleteCommunicationCommand): Promise<void> {
    const communication = await this.repository.get(command.id);
    if (!communication) {
      throw new CommunicationNotFoundException();
    }
    if (communication.status === CommunicationStatus.SENT) {
      throw new CommunicationAlreadySentException();
    }

    await this.communicationStudentRepository.deleteByCommunication(
      communication.id,
    );

    await this.repository.delete(command.id);
  }
}
