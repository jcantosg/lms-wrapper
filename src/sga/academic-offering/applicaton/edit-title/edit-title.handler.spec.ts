import { EditTitleHandler } from '#academic-offering/applicaton/edit-title/edit-title.handler';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { TitleGetter } from '#academic-offering/domain/service/title-getter.service';
import { EditTitleCommand } from '#academic-offering/applicaton/edit-title/edit-title.command';
import {
  getABusinessUnit,
  getAnAdminUser,
  getATitle,
} from '#test/entity-factory';
import { TitleMockRepository } from '#test/mocks/sga/academic-offering/title.mock-repository';
import {
  getATitleGetterMock,
  getBusinessUnitGetterMock,
} from '#test/service-factory';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';

let handler: EditTitleHandler;
let repository: TitleRepository;
let businessUnitGetter: BusinessUnitGetter;
let titleGetter: TitleGetter;

let updateSpy: jest.SpyInstance;
let getBusinessUnitSpy: jest.SpyInstance;
let getTitleSpy: jest.SpyInstance;

const businessUnit = getABusinessUnit();
const title = getATitle();

const command = new EditTitleCommand(
  'id',
  'name',
  'officialCode',
  'title',
  'program',
  businessUnit.id,
  getAnAdminUser(),
);

describe('Edit Title Handler', () => {
  beforeAll(() => {
    repository = new TitleMockRepository();
    businessUnitGetter = getBusinessUnitGetterMock();
    titleGetter = getATitleGetterMock();
    handler = new EditTitleHandler(repository, titleGetter, businessUnitGetter);
    updateSpy = jest.spyOn(repository, 'save');
    getBusinessUnitSpy = jest.spyOn(businessUnitGetter, 'getByAdminUser');
    getTitleSpy = jest.spyOn(titleGetter, 'getByAdminUser');
  });

  it('should update a title', async () => {
    getTitleSpy.mockImplementation(
      (): Promise<Title> => Promise.resolve(title),
    );
    getBusinessUnitSpy.mockImplementation(
      (): Promise<BusinessUnit> => Promise.resolve(businessUnit),
    );

    await handler.handle(command);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _officialCode: 'officialCode',
        _officialTitle: 'title',
        _name: 'name',
      }),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
