import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';
import { ReadCommunicationCommand } from '#student-360/communications/application/read-communication/read-communication.command';
import { CommunicationNotFoundException } from '#shared/domain/exception/communication/communication.not-found.exception';

export class ReadCommunicationHandler implements QueryHandler {
  constructor(
    private readonly communicationStudentRepository: CommunicationStudentRepository,
  ) {}

  async handle(command: ReadCommunicationCommand): Promise<void> {
    const communication =
      await this.communicationStudentRepository.getByCommunicationAndStudent(
        command.communicationId,
        command.student.id,
      );
    if (!communication) {
      throw new CommunicationNotFoundException();
    }
    communication.read();

    await this.communicationStudentRepository.save(communication);
  }
}
