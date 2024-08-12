import { CreateCommunicationController } from '#shared/infrastructure/controller/communication/create-communication/create-communication.controller';
import { SearchCommunicationsController } from '#shared/infrastructure/controller/communication/search-communications/search-communications.controller';
import { GetCommunicationsController } from '#shared/infrastructure/controller/communication/get-communications/get-communications.controller';

export const communicationControllers = [
  GetCommunicationsController,
  SearchCommunicationsController,
  CreateCommunicationController,
];
