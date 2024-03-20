import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { getBusinessUnitGetterMock } from '#test/service-factory';
import { getABusinessUnit, getAnAdminUser } from '#test/entity-factory';
import { v4 as uuid } from 'uuid';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import clearAllMocks = jest.clearAllMocks;
import { CreateTitleHandler } from '#academic-offering/applicaton/create-title/create-title.handler';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { CreateTitleCommand } from '#academic-offering/applicaton/create-title/create-title.command';
import { TitleMockRepository } from '#test/mocks/sga/academic-offering/title.mock-repository';
import { TitleDuplicatedException } from '#shared/domain/exception/academic-offering/title.duplicated.exception';

let handler: CreateTitleHandler;
let repository: TitleRepository;
let businessUnitGetter: BusinessUnitGetter;

let saveSpy: jest.SpyInstance;
let getBusinessUnitSpy: jest.SpyInstance;
let existsSpy: jest.SpyInstance;

const businessUnit = getABusinessUnit();
const command = new CreateTitleCommand(
  uuid(),
  'name',
  'code',
  'title',
  'program',
  businessUnit.id,
  getAnAdminUser(),
);

describe('Create Title Handler', () => {
  beforeAll(() => {
    repository = new TitleMockRepository();
    businessUnitGetter = getBusinessUnitGetterMock();
    handler = new CreateTitleHandler(repository, businessUnitGetter);
    saveSpy = jest.spyOn(repository, 'save');
    getBusinessUnitSpy = jest.spyOn(businessUnitGetter, 'getByAdminUser');
    existsSpy = jest.spyOn(repository, 'exists');
  });

  it('should throw a TitleDuplicatedException', async () => {
    existsSpy.mockImplementation((): Promise<boolean> => Promise.resolve(true));
    await expect(handler.handle(command)).rejects.toThrow(
      TitleDuplicatedException,
    );
  });

  it('should save a title', async () => {
    existsSpy.mockImplementation(
      (): Promise<boolean> => Promise.resolve(false),
    );
    getBusinessUnitSpy.mockImplementation(
      (): Promise<BusinessUnit> => Promise.resolve(businessUnit),
    );

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: command.id,
        name: command.name,
        officialCode: command.officialCode,
        officialTitle: command.officialTitle,
        officialProgram: command.officialProgram,
        businessUnit: businessUnit,
        createdBy: command.adminUser,
      }),
    );
  });

  afterAll(() => {
    clearAllMocks();
  });
});
