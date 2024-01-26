import { CreateVirtualCampusHandler } from '#business-unit/application/create-virtual-campus/create-virtual-campus.handler';
import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { VirtualCampusMockRepository } from '#test/mocks/sga/business-unit/virtual-campus.mock-repository';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { getABusinessUnit, getAnAdminUser } from '#test/entity-factory';
import { v4 as uuid } from 'uuid';
import { CreateVirtualCampusCommand } from '#business-unit/application/create-virtual-campus/create-virtual-campus.command';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit-not-found.exception';
import { VirtualCampusDuplicatedException } from '#shared/domain/exception/business-unit/virtual-campus-duplicated.exception';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import {
  getAdminUserGetterMock,
  getBusinessUnitGetterMock,
} from '#test/service-factory';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

let handler: CreateVirtualCampusHandler;
let virtualCampusRepository: VirtualCampusRepository;
let getBusinessUnitSpy: any;
let existsByIdVirtualCampus: any;
let saveVirtualCampusSpy: any;
let getUserSpy: any;
const businessUnit: BusinessUnit = getABusinessUnit(uuid());
let adminUserGetter: AdminUserGetter;
let businessUnitGetter: BusinessUnitGetter;

const user = getAnAdminUser();
user.addBusinessUnit(businessUnit);

const command = new CreateVirtualCampusCommand(
  uuid(),
  'name',
  'code',
  businessUnit.id,
  uuid(),
);

describe('Create Virtual Campus Handler', () => {
  beforeAll(() => {
    adminUserGetter = getAdminUserGetterMock();
    businessUnitGetter = getBusinessUnitGetterMock();
    virtualCampusRepository = new VirtualCampusMockRepository();
    getBusinessUnitSpy = jest.spyOn(businessUnitGetter, 'get');
    saveVirtualCampusSpy = jest.spyOn(virtualCampusRepository, 'save');
    existsByIdVirtualCampus = jest.spyOn(virtualCampusRepository, 'existsById');
    getUserSpy = jest.spyOn(adminUserGetter, 'get');
    handler = new CreateVirtualCampusHandler(
      virtualCampusRepository,
      businessUnitGetter,
      adminUserGetter,
    );
  });

  it('should create a virtual campus', async () => {
    getBusinessUnitSpy.mockImplementation((): Promise<BusinessUnit | null> => {
      return Promise.resolve(businessUnit);
    });
    getUserSpy.mockImplementation((): Promise<AdminUser | null> => {
      return Promise.resolve(user);
    });
    existsByIdVirtualCampus.mockImplementation((): Promise<boolean> => {
      return Promise.resolve(false);
    });
    await handler.handle(command);
    expect(saveVirtualCampusSpy).toHaveBeenCalledTimes(1);
    expect(saveVirtualCampusSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: command.id,
        _name: command.name,
        _code: command.code,
        _createdBy: user,
        _updatedBy: user,
        _isActive: true,
      }),
    );
  });
  it('should throw a Business Not Found Exception', async () => {
    getBusinessUnitSpy.mockImplementation((): Promise<BusinessUnit | null> => {
      throw new BusinessUnitNotFoundException();
    });
    await expect(handler.handle(command)).rejects.toThrow(
      BusinessUnitNotFoundException,
    );
  });

  it('should throw a Virtual Campus Duplicated Exception', async () => {
    getBusinessUnitSpy.mockImplementation((): Promise<BusinessUnit | null> => {
      return Promise.resolve(businessUnit);
    });
    getUserSpy.mockImplementation((): Promise<AdminUser | null> => {
      return Promise.resolve(user);
    });
    existsByIdVirtualCampus.mockImplementation((): Promise<boolean> => {
      return Promise.resolve(true);
    });
    await expect(handler.handle(command)).rejects.toThrow(
      VirtualCampusDuplicatedException,
    );
  });
});
