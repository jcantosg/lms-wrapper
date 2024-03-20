import { Title } from '#academic-offering/domain/entity/title.entity';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { TitleGetter } from '#academic-offering/domain/service/title-getter.service';
import { TitleNotFoundException } from '#shared/domain/exception/academic-offering/title-not-found.exception';
import { getATitle } from '#test/entity-factory';
import { TitleMockRepository } from '#test/mocks/sga/academic-offering/title.mock-repository';

let service: TitleGetter;
let titleRepository: TitleRepository;

let getTitleSpy: any;

const title = getATitle();

describe('Title Getter', () => {
  beforeAll(() => {
    titleRepository = new TitleMockRepository();

    getTitleSpy = jest.spyOn(titleRepository, 'get');

    service = new TitleGetter(titleRepository);
  });

  it('Should return a title', async () => {
    getTitleSpy.mockImplementation((): Promise<Title | null> => {
      return Promise.resolve(title);
    });

    const result = await service.get('titleId');

    expect(result).toBe(title);
  });

  it('Should throw a TitleNotFoundException', async () => {
    getTitleSpy.mockImplementation((): Promise<Title | null> => {
      return Promise.resolve(null);
    });

    await expect(service.get('titleId')).rejects.toThrow(
      TitleNotFoundException,
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
