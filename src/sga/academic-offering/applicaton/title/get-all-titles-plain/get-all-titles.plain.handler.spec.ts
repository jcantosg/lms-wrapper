import { getABusinessUnit, getATitle } from '#test/entity-factory';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { TitleMockRepository } from '#test/mocks/sga/academic-offering/title.mock-repository';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { GetAllTitlesPlainQuery } from '#academic-offering/applicaton/title/get-all-titles-plain/get-all-titles-plain.query';
import { GetAllTitlesPlainHandler } from '#academic-offering/applicaton/title/get-all-titles-plain/get-all-titles-plain.handler';
import clearAllMocks = jest.clearAllMocks;

let repository: TitleRepository;

let getByBusinessUnitsSpy: jest.SpyInstance;

const businessUnit = getABusinessUnit();
const titles = [getATitle(), getATitle()];
const query = new GetAllTitlesPlainQuery([businessUnit.id], [businessUnit.id]);
let handler: GetAllTitlesPlainHandler;

describe('Get All titles plain Handler', () => {
  beforeAll(() => {
    repository = new TitleMockRepository();
    handler = new GetAllTitlesPlainHandler(repository);
    getByBusinessUnitsSpy = jest.spyOn(repository, 'getByBusinessUnits');
  });

  it('should return an array of titles', async () => {
    getByBusinessUnitsSpy.mockImplementation((): Promise<Title[]> => {
      return Promise.resolve(titles);
    });
    const result = await handler.handle(query);
    expect(getByBusinessUnitsSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(titles);
  });

  afterAll(() => {
    clearAllMocks();
  });
});
