import { GetStudentCommunicationsHandler } from '#student-360/communications/application/get-student-communications/get-student-communications.handler';
import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';
import { GetNewCommunicationsCountHandler } from '#student-360/communications/application/get-new-communications-count/get-new-communications-count.handler';

const getStudentCommunicationsHandler = {
  provide: GetStudentCommunicationsHandler,
  useFactory: (
    repository: CommunicationStudentRepository,
  ): GetStudentCommunicationsHandler =>
    new GetStudentCommunicationsHandler(repository),
  inject: [CommunicationStudentRepository],
};

const getNewCommunicationsCountHandler = {
  provide: GetNewCommunicationsCountHandler,
  useFactory: (
    repository: CommunicationStudentRepository,
  ): GetNewCommunicationsCountHandler =>
    new GetNewCommunicationsCountHandler(repository),
  inject: [CommunicationStudentRepository],
};

export const communicationHandlers = [
  getStudentCommunicationsHandler,
  getNewCommunicationsCountHandler,
];
