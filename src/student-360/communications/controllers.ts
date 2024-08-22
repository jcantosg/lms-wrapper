import { DeleteCommunicationController } from '#student-360/communications/infrastructure/controller/delete-communication.controller';
import { GetStudentCommunicationsController } from '#student-360/communications/infrastructure/controller/get-communications/get-communications.controller';
import { GetNewCommunicationsCountController } from '#student-360/communications/infrastructure/controller/get-new-communications-count.controller';
import { ReadCommunicationController } from '#student-360/communications/infrastructure/controller/read-communication.controller';

export const communicationControllers = [
  GetStudentCommunicationsController,
  GetNewCommunicationsCountController,
  ReadCommunicationController,
  DeleteCommunicationController,
];
