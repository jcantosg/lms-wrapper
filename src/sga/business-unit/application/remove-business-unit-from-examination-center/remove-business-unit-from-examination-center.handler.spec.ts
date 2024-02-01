import { v4 as uuid } from 'uuid';
import {
  getABusinessUnit,
  getAnAdminUser,
  getAnExaminationCenter,
} from '#test/entity-factory';
import { ExaminationCenterMockRepository } from '#test/mocks/sga/business-unit/examination-center.mock-repository';
import {
  getAdminUserGetterMock,
  getAnExaminationCenterGetterMock,
  getBusinessUnitGetterMock,
} from '#test/service-factory';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { RemoveBusinessUnitFromExaminationCenterHandler } from '#business-unit/application/remove-business-unit-from-examination-center/remove-business-unit-from-examination-center.handler';
import { RemoveBusinessUnitFromExaminationCenterCommand } from '#business-unit/application/remove-business-unit-from-examination-center/remove-business-unit-from-examination-center.command';

let handler: RemoveBusinessUnitFromExaminationCenterHandler;
let examinationCenterRepository: ExaminationCenterRepository;
let examinationCenterGetter: ExaminationCenterGetter;
let businessUnitGetter: BusinessUnitGetter;
let adminUserGetter: AdminUserGetter;

let getUserSpy: any;
let updateSpy: any;
let getExaminationCenterSpy: any;
let getBusinessUnitsSpy: any;

const businessUnit = getABusinessUnit();
const examinationCenter = getAnExaminationCenter();

const user = getAnAdminUser();
user.addBusinessUnit(businessUnit);

const command = new RemoveBusinessUnitFromExaminationCenterCommand(
  uuid(),
  user,
  businessUnit.id,
);

describe('Remove Business Unit from Examination Center', () => {
  beforeAll(() => {
    adminUserGetter = getAdminUserGetterMock();
    examinationCenterRepository = new ExaminationCenterMockRepository();
    examinationCenterGetter = getAnExaminationCenterGetterMock();
    businessUnitGetter = getBusinessUnitGetterMock();

    getUserSpy = jest.spyOn(adminUserGetter, 'get');
    getBusinessUnitsSpy = jest.spyOn(businessUnitGetter, 'get');
    getExaminationCenterSpy = jest.spyOn(examinationCenterGetter, 'get');
    updateSpy = jest.spyOn(examinationCenterRepository, 'update');

    handler = new RemoveBusinessUnitFromExaminationCenterHandler(
      examinationCenterRepository,
      businessUnitGetter,
      examinationCenterGetter,
    );
  });

  it('should remove a business unit from an examination center', async () => {
    getBusinessUnitsSpy.mockImplementation((): Promise<BusinessUnit> => {
      return Promise.resolve(businessUnit);
    });

    getUserSpy.mockImplementation((): Promise<AdminUser | null> => {
      return Promise.resolve(user);
    });

    getExaminationCenterSpy.mockImplementation(
      (): Promise<ExaminationCenter | null> => {
        return Promise.resolve(examinationCenter);
      },
    );

    await handler.handle(command);

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _code: 'code',
        _name: 'name',
        _businessUnits: expect.not.arrayContaining([businessUnit]),
      }),
    );
  });
});
