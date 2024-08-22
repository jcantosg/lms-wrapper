import { GetStudentCommunicationsHandler } from '#student-360/communications/application/get-student-communications/get-student-communications.handler';
import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';
import { GetNewCommunicationsCountHandler } from '#student-360/communications/application/get-new-communications-count/get-new-communications-count.handler';
import { ReadCommunicationHandler } from '#student-360/communications/application/read-communication/read-communication.handler';
import { DeleteCommunicationHandler } from '#student-360/communications/application/delete-communication/delete-communication.handler';

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

const readCommunicationHandler = {
  provide: ReadCommunicationHandler,
  useFactory: (
    repository: CommunicationStudentRepository,
  ): ReadCommunicationHandler => new ReadCommunicationHandler(repository),
  inject: [CommunicationStudentRepository],
};

const deleteCommunicationHandler = {
  provide: DeleteCommunicationHandler,
  useFactory: (
    repository: CommunicationStudentRepository,
  ): DeleteCommunicationHandler => new DeleteCommunicationHandler(repository),
  inject: [CommunicationStudentRepository],
};

export const communicationHandlers = [
  getStudentCommunicationsHandler,
  getNewCommunicationsCountHandler,
  readCommunicationHandler,
  deleteCommunicationHandler,
];
