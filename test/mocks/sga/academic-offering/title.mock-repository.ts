import { TitleRepository } from '#academic-offering/domain/repository/title.repository';

export class TitleMockRepository implements TitleRepository {
  exists = jest.fn();
  save = jest.fn();
}
