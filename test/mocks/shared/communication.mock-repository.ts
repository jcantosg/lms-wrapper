import { CommunicationRepository } from '#shared/domain/repository/communication.repository';

export class CommunicationMockRepository implements CommunicationRepository {
  exists = jest.fn();
  save = jest.fn();
  matching = jest.fn();
  count = jest.fn();
}
