import { v4 as uuid } from 'uuid';
import { EditVirtualCampusHandler } from '#business-unit/application/virtual-campus/edit-virtual-campus/edit-virtual-campus.handler';
import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { EditVirtualCampusCommand } from '#business-unit/application/virtual-campus/edit-virtual-campus/edit-virtual-campus.command';
import {
  getACountry,
  getAnAdminUser,
  getAVirtualCampus,
} from '#test/entity-factory';
import { getVirtualCampusGetterMock } from '#test/service-factory';
import { VirtualCampusMockRepository } from '#test/mocks/sga/business-unit/virtual-campus.mock-repository';
import { VirtualCampusGetter } from '#business-unit/domain/service/virtual-campus-getter.service';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { VirtualCampusBusinessUnitInactiveException } from '#shared/domain/exception/business-unit/virtual-campus-business-unit-inactive.exception';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

let handler: EditVirtualCampusHandler;
let virtualCampusRepository: VirtualCampusRepository;
let virtualCampusGetter: VirtualCampusGetter;

let updateSpy: any;
let getVirtualCampusSpy: any;

const user = getAnAdminUser();
const command = new EditVirtualCampusCommand(
  uuid(),
  'name',
  'code',
  user,
  true,
);

const virtualCampus = getAVirtualCampus(command.id);
const inactiveBusinessUnit = BusinessUnit.create(
  uuid(),
  'test',
  'test',
  getACountry(),
  user,
);
user.addBusinessUnit(inactiveBusinessUnit);
inactiveBusinessUnit.isActive = false;
const virtualCampusInactive = getAVirtualCampus(command.id);
virtualCampusInactive.isActive = false;
virtualCampusInactive.businessUnit = inactiveBusinessUnit;

user.addBusinessUnit(virtualCampus.businessUnit);

describe('Edit Virtual Campus Handler', () => {
  beforeAll(() => {
    virtualCampusRepository = new VirtualCampusMockRepository();
    virtualCampusGetter = getVirtualCampusGetterMock();

    getVirtualCampusSpy = jest.spyOn(virtualCampusGetter, 'get');
    updateSpy = jest.spyOn(virtualCampusRepository, 'update');
    handler = new EditVirtualCampusHandler(
      virtualCampusRepository,
      virtualCampusGetter,
    );
  });

  it('should edit a virtual campus', async () => {
    getVirtualCampusSpy.mockImplementation(
      (): Promise<VirtualCampus | null> => {
        return Promise.resolve(virtualCampus);
      },
    );
    await handler.handle(command);

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _code: 'code',
        _name: 'name',
      }),
    );
  });

  it('should throw a VirtualCampusBusinessUnitInactive error', async () => {
    getVirtualCampusSpy.mockImplementation(
      (): Promise<VirtualCampus | null> => {
        return Promise.resolve(virtualCampusInactive);
      },
    );
    await expect(handler.handle(command)).rejects.toThrow(
      VirtualCampusBusinessUnitInactiveException,
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
