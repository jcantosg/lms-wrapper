import { GetStudentCommunicationsHandler } from '#student-360/communications/application/get-student-communications/get-student-communications.handler';
import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';

const getStudentCommunicationsHandler = {
  provide: GetStudentCommunicationsHandler,
  useFactory: (
    repository: CommunicationStudentRepository,
  ): GetStudentCommunicationsHandler =>
    new GetStudentCommunicationsHandler(repository),
  inject: [CommunicationStudentRepository],
};

export const communicationHandlers = [getStudentCommunicationsHandler];
