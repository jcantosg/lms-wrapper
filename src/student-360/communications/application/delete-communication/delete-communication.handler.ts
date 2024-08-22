import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';
import { CommunicationNotFoundException } from '#shared/domain/exception/communication/communication.not-found.exception';
import { DeleteCommunicationCommand } from '#student-360/communications/application/delete-communication/delete-communication.command';

export class DeleteCommunicationHandler implements QueryHandler {
  constructor(
    private readonly communicationStudentRepository: CommunicationStudentRepository,
  ) {}

  async handle(command: DeleteCommunicationCommand): Promise<void> {
    const communication =
      await this.communicationStudentRepository.getByCommunicationAndStudent(
        command.communicationId,
        command.student.id,
      );
    if (!communication) {
      throw new CommunicationNotFoundException();
    }
    communication.delete();

    await this.communicationStudentRepository.save(communication);
  }
}
