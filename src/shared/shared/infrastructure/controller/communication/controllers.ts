import { CreateCommunicationController } from '#shared/infrastructure/controller/communication/create-communication/create-communication.controller';
import { SearchCommunicationsController } from '#shared/infrastructure/controller/communication/search-communications/search-communications.controller';
import { GetCommunicationsController } from '#shared/infrastructure/controller/communication/get-communications/get-communications.controller';
import { GetCommunicationController } from '#shared/infrastructure/controller/communication/get-communication/get-communication.controller';
import { EditCommunicationController } from '#shared/infrastructure/controller/communication/edit-communication/edit-communication.controller';
import { DeleteCommunicationController } from '#shared/infrastructure/controller/communication/delete-communication/delete-communication.controller';

export const communicationControllers = [
  GetCommunicationsController,
  SearchCommunicationsController,
  CreateCommunicationController,
  GetCommunicationController,
  EditCommunicationController,
  DeleteCommunicationController,
];
