import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';
import { EdaeUserMockRepository } from '#test/mocks/sga/edae-user/edae-user.mock-repository';
import { getAnEdaeUser } from '#test/entity-factory';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { SearchEdaeUsersHandler } from '#edae-user/application/search-edae-users/search-edae-users.handler';
import { SearchEdaeUsersQuery } from '#edae-user/application/search-edae-users/search-edae-users.query';
import { OrderByDefault, OrderTypes } from '#/sga/shared/domain/criteria/order';
import { DEFAULT_LIMIT } from '#/sga/shared/application/collection.query';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { getBusinessUnitGetterMock } from '#test/service-factory';

let handler: SearchEdaeUsersHandler;
let businessUnitGetter: BusinessUnitGetter;
let repository: EdaeUserRepository;
const query = new SearchEdaeUsersQuery(
  'example',
  OrderByDefault,
  OrderTypes.DESC,
  1,
  DEFAULT_LIMIT,
  [],
  true,
);
let matchingSpy: any;
let countSpy: any;
const expectedUsers = [getAnEdaeUser(), getAnEdaeUser()];
describe('search all edae users handler', () => {
  beforeAll(() => {
    repository = new EdaeUserMockRepository();
    businessUnitGetter = getBusinessUnitGetterMock();
    handler = new SearchEdaeUsersHandler(repository, businessUnitGetter);
    matchingSpy = jest.spyOn(repository, 'matching');
    countSpy = jest.spyOn(repository, 'count');
  });

  it('should return an edae users list', async () => {
    matchingSpy.mockImplementation((): Promise<EdaeUser[]> => {
      return Promise.resolve(expectedUsers);
    });
    countSpy.mockImplementation((): Promise<number> => {
      return Promise.resolve(expectedUsers.length);
    });
    const collectionResponse = await handler.handle(query);
    expect(collectionResponse.total).toEqual(expectedUsers.length);
    expect(collectionResponse.items).toEqual(expectedUsers);
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
