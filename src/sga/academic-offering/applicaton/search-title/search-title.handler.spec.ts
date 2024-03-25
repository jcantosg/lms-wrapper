import { getABusinessUnit, getAnAdminUser } from '#test/entity-factory';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { OrderByDefault, OrderTypes } from '#/sga/shared/domain/criteria/order';
import { DEFAULT_LIMIT } from '#/sga/shared/application/collection.query';
import { SearchTitleHandler } from '#academic-offering/applicaton/search-title/search-title.handler';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { SearchTitleQuery } from '#academic-offering/applicaton/search-title/search-title.query';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { TitleMockRepository } from '#test/mocks/sga/academic-offering/title.mock-repository';

let handler: SearchTitleHandler;
let repository: TitleRepository;
const query = new SearchTitleQuery(
  1,
  DEFAULT_LIMIT,
  OrderByDefault,
  OrderTypes.DESC,
  'example',
  [],
  true,
);
let matchingSpy: any;
let countSpy: any;
const expetedTitles = [
  Title.create(
    '184aa97f-7a3f-4037-a4df-c95045158bd4',
    'Desarrollo Aplicaciones',
    'DAW',
    'Desarrollo Aplicaciones Web',
    'TestOfficialProgram',
    getABusinessUnit(),
    getAnAdminUser(),
  ),
];
describe('search all titles handler', () => {
  beforeAll(() => {
    repository = new TitleMockRepository();
    handler = new SearchTitleHandler(repository);
    matchingSpy = jest.spyOn(repository, 'matching');
    countSpy = jest.spyOn(repository, 'count');
  });

  it('should return an title', async () => {
    matchingSpy.mockImplementation((): Promise<Title[]> => {
      return Promise.resolve(expetedTitles);
    });
    countSpy.mockImplementation((): Promise<number> => {
      return Promise.resolve(expetedTitles.length);
    });
    const collectionResponse = await handler.handle(query);
    expect(collectionResponse.total).toEqual(expetedTitles.length);
    expect(collectionResponse.items).toEqual(expetedTitles);
  });
  it('should return an empty array', async () => {
    matchingSpy.mockImplementation((): Promise<EdaeUser[]> => {
      return Promise.resolve([]);
    });
    countSpy.mockImplementation((): Promise<number> => {
      return Promise.resolve(0);
    });
    const collectionResponse = await handler.handle(query);
    expect(collectionResponse.total).toEqual(0);
    expect(collectionResponse.items).toEqual([]);
  });
});
