import { CommunicationRepository } from '#shared/domain/repository/communication.repository';

export class CommunicationMockRepository implements CommunicationRepository {
  exists = jest.fn();
  save = jest.fn();
}
