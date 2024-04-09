import { OrderByDefault, OrderTypes } from '#/sga/shared/domain/criteria/order';
import { getABusinessUnit, getAnAdminUser } from '#test/entity-factory';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { TitleMockRepository } from '#test/mocks/sga/academic-offering/title.mock-repository';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { GetAllTitlesListQuery } from '#academic-offering/applicaton/title/get-all-titles/get-title-list.query';
import { GetTitleListHandler } from '#academic-offering/applicaton/title/get-all-titles/get-title-list.handler';

let handler: GetTitleListHandler;
let repository: TitleRepository;
const query = new GetAllTitlesListQuery(
  0,
  15,
  OrderByDefault,
  OrderTypes.ASC,
  true,
  [],
);
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
let matchingSpy: any;
let countSpy: any;
describe('get all titles handler', () => {
  beforeAll(() => {
    repository = new TitleMockRepository();
    handler = new GetTitleListHandler(repository);
    matchingSpy = jest.spyOn(repository, 'matching');
    countSpy = jest.spyOn(repository, 'count');
  });

  it('should return an titles list', async () => {
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
