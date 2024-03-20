import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { getABusinessUnit, getATitle } from '#test/entity-factory';
import { getBusinessUnitGetterMock } from '#test/service-factory';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { GetAllTitlesPlainQuery } from '#academic-offering/applicaton/get-all-titles-plain/get-all-titles-plain.query';
import { GetAllTitlesPlainHandler } from '#academic-offering/applicaton/get-all-titles-plain/get-all-titles-plain.handler';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { TitleMockRepository } from '#test/mocks/sga/academic-offering/title.mock-repository';
import clearAllMocks = jest.clearAllMocks;
import { Title } from '#academic-offering/domain/entity/title.entity';

let repository: TitleRepository;
let businessUnitGetter: BusinessUnitGetter;

let getByBusinessUnitSpy: jest.SpyInstance;
let getBusinessUnitSpy: jest.SpyInstance;

const businessUnit = getABusinessUnit();
const titles = [getATitle(), getATitle()];
const query = new GetAllTitlesPlainQuery(businessUnit.id, [businessUnit.id]);
let handler: GetAllTitlesPlainHandler;

describe('Get All titles plain Handler', () => {
  beforeAll(() => {
    repository = new TitleMockRepository();
    businessUnitGetter = getBusinessUnitGetterMock();
    handler = new GetAllTitlesPlainHandler(repository, businessUnitGetter);
    getByBusinessUnitSpy = jest.spyOn(repository, 'getByBusinessUnit');
    getBusinessUnitSpy = jest.spyOn(businessUnitGetter, 'getByAdminUser');
  });

  it('should throw a business unit not found exception', async () => {
    getBusinessUnitSpy.mockImplementation(() => {
      throw new BusinessUnitNotFoundException();
    });
    await expect(handler.handle(query)).rejects.toThrow(
      BusinessUnitNotFoundException,
    );
  });

  it('should return an array of titles', async () => {
    getBusinessUnitSpy.mockImplementation((): Promise<BusinessUnit> => {
      return Promise.resolve(businessUnit);
    });
    getByBusinessUnitSpy.mockImplementation((): Promise<Title[]> => {
      return Promise.resolve(titles);
    });
    const result = await handler.handle(query);
    expect(getByBusinessUnitSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(titles);
  });

  afterAll(() => {
    clearAllMocks();
  });
});
