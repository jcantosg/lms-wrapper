import { GetVirtualCampusByBusinessUnitHandler } from '#business-unit/application/virtual-campus/get-virtual-campus-by-business-unit/get-virtual-campus-by-business-unit.handler';
import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { getABusinessUnit, getAnAdminUser } from '#test/entity-factory';
import { GetVirtualCampusByBusinessUnitQuery } from '#business-unit/application/virtual-campus/get-virtual-campus-by-business-unit/get-virtual-campus-by-business-unit.query';
import { VirtualCampusMockRepository } from '#test/mocks/sga/business-unit/virtual-campus.mock-repository';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';

let handler: GetVirtualCampusByBusinessUnitHandler;
let virtualCampusRepository: VirtualCampusRepository;
let getByBusinessUnitSpy: jest.SpyInstance;

const businessUnit = getABusinessUnit('77d43a8a-daa8-4812-816f-0cf8c7808dd0');
const adminUser = getAnAdminUser();

const query = new GetVirtualCampusByBusinessUnitQuery(
  businessUnit.id,
  adminUser,
);

describe('Get Virtual Campus By Business Unit Handler', () => {
  beforeAll(() => {
    virtualCampusRepository = new VirtualCampusMockRepository();
    getByBusinessUnitSpy = jest.spyOn(
      virtualCampusRepository,
      'getByBusinessUnit',
    );
    handler = new GetVirtualCampusByBusinessUnitHandler(
      virtualCampusRepository,
    );
  });

  it('should return 404 if the business unit is not found', async () => {
    await expect(handler.handle(query)).rejects.toThrow(
      BusinessUnitNotFoundException,
    );
  });

  it('should return virtual campus', async () => {
    adminUser.businessUnits.push(businessUnit);
    getByBusinessUnitSpy.mockImplementation(() => {
      return Promise.resolve([businessUnit]);
    });

    const virtualCampus = await handler.handle(query);
    expect(getByBusinessUnitSpy).toHaveBeenCalledTimes(1);
    expect(virtualCampus).toEqual([businessUnit]);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
