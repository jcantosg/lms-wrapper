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
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { RemoveExaminationCentersFromBusinessUnitCommand } from '#business-unit/application/remove-examination-center-from-business-unit/remove-examination-center-from-business-unit.command';
import { RemoveExaminationCentersFromBusinessUnitHandler } from '#business-unit/application/remove-examination-center-from-business-unit/remove-examination-center-from-business-unit.handler';

let handler: RemoveExaminationCentersFromBusinessUnitHandler;
let businessUnitRepository: BusinessUnitRepository;
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

const command = new RemoveExaminationCentersFromBusinessUnitCommand(
  uuid(),
  user,
  examinationCenter.id,
);

describe('Remove Examination centers from Business Unit', () => {
  beforeAll(() => {
    adminUserGetter = getAdminUserGetterMock();
    businessUnitRepository = new ExaminationCenterMockRepository();
    examinationCenterGetter = getAnExaminationCenterGetterMock();
    businessUnitGetter = getBusinessUnitGetterMock();

    getUserSpy = jest.spyOn(adminUserGetter, 'get');
    getBusinessUnitsSpy = jest.spyOn(businessUnitGetter, 'get');
    getExaminationCenterSpy = jest.spyOn(examinationCenterGetter, 'get');
    updateSpy = jest.spyOn(businessUnitRepository, 'update');

    handler = new RemoveExaminationCentersFromBusinessUnitHandler(
      businessUnitRepository,
      businessUnitGetter,
      examinationCenterGetter,
    );
  });

  it('should remove examination center from business unit', async () => {
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
        _examinationCenters: expect.not.arrayContaining([examinationCenter]),
      }),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
