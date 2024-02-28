import { v4 as uuid } from 'uuid';
import {
  getABusinessUnit,
  getAnAdminUser,
  getAnEdaeUser,
} from '#test/entity-factory';
import {
  getAdminUserGetterMock,
  getBusinessUnitGetterMock,
  getEdaeUserGetterMock,
} from '#test/service-factory';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AddBusinessUnitsToEdaeUserHandler } from '#edae-user/application/add-business-units-to-edae-user/add-business-units-to-edae-user.handler';
import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { AddBusinessUnitsToEdaeUserCommand } from '#edae-user/application/add-business-units-to-edae-user/add-business-units-to-edae-user.command';
import { EdaeUserMockRepository } from '#test/mocks/sga/edae-user/edae-user.mock-repository';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';

let handler: AddBusinessUnitsToEdaeUserHandler;
let edaeUserRepository: EdaeUserRepository;
let edaeUserGetter: EdaeUserGetter;
let businessUnitGetter: BusinessUnitGetter;
let adminUserGetter: AdminUserGetter;

let getAdminUserSpy: any;
let updateSpy: any;
let getEdaeUserSpy: any;
let getBusinessUnitsSpy: any;

const businessUnit = getABusinessUnit();
const edaeUser = getAnEdaeUser();

const adminUser = getAnAdminUser();
adminUser.addBusinessUnit(businessUnit);

const command = new AddBusinessUnitsToEdaeUserCommand(uuid(), adminUser, [
  businessUnit.id,
]);

describe('Add Business Units to Edae User', () => {
  beforeAll(() => {
    adminUserGetter = getAdminUserGetterMock();
    edaeUserRepository = new EdaeUserMockRepository();
    edaeUserGetter = getEdaeUserGetterMock();
    businessUnitGetter = getBusinessUnitGetterMock();

    getAdminUserSpy = jest.spyOn(adminUserGetter, 'get');
    getBusinessUnitsSpy = jest.spyOn(businessUnitGetter, 'getByAdminUser');
    getEdaeUserSpy = jest.spyOn(edaeUserGetter, 'get');
    updateSpy = jest.spyOn(edaeUserRepository, 'update');

    handler = new AddBusinessUnitsToEdaeUserHandler(
      edaeUserRepository,
      businessUnitGetter,
      edaeUserGetter,
    );
  });

  it('should add business units to edae user', async () => {
    getBusinessUnitsSpy.mockImplementation((): Promise<BusinessUnit> => {
      return Promise.resolve(businessUnit);
    });

    getAdminUserSpy.mockImplementation((): Promise<AdminUser | null> => {
      return Promise.resolve(adminUser);
    });

    getEdaeUserSpy.mockImplementation((): Promise<EdaeUser | null> => {
      return Promise.resolve(edaeUser);
    });

    await handler.handle(command);

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _name: 'test',
        _businessUnits: expect.arrayContaining([businessUnit]),
      }),
    );
  });
});
