import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';
import { DeleteCommunicationCommand } from '#student-360/communications/application/delete-communication/delete-communication.command';

export class DeleteCommunicationHandler implements QueryHandler {
  constructor(
    private readonly communicationStudentRepository: CommunicationStudentRepository,
  ) {}

  async handle(command: DeleteCommunicationCommand): Promise<void> {
    for (const id of command.communicationIds) {
      const communication =
        await this.communicationStudentRepository.getByCommunicationAndStudent(
          id,
          command.student.id,
        );
      if (communication) {
        communication.delete();

        await this.communicationStudentRepository.save(communication);
      }
    }
  }
}
