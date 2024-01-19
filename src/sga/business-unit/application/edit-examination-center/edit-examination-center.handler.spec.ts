import { getAnAdminUser, getAnExaminationCenter } from '#test/entity-factory';
import { ExaminationCenterMockRepository } from '#test/mocks/sga/business-unit/examination-center.mock-repository';
import {
  getAdminUserGetterMock,
  getAnExaminationCenterGetterMock,
  getBusinessUnitGetterMock,
} from '#test/service-factory';
import { v4 as uuid } from 'uuid';
import { EditExaminationCenterHandler } from './edit-examination-center.handler';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { EditExaminationCenterCommand } from './edit-examination-center.command';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';

let handler: EditExaminationCenterHandler;
let examinationCenterRepository: ExaminationCenterRepository;
let examinationCenterGetter: ExaminationCenterGetter;
let businessUnitGetter: BusinessUnitGetter;
let adminUserGetter: AdminUserGetter;

let getUserSpy: any;
let updateSpy: any;
let getExaminationCenterSpy: any;
let getBusinessUnitsSpy: any;

const command = new EditExaminationCenterCommand(
  uuid(),
  'name',
  'code',
  'address',
  [uuid()],
  uuid(),
  true,
);

const user = getAnAdminUser();
const examinationCenter = getAnExaminationCenter(command.id);

describe('Edit Examination Center Handler', () => {
  beforeAll(() => {
    adminUserGetter = getAdminUserGetterMock();
    examinationCenterRepository = new ExaminationCenterMockRepository();
    examinationCenterGetter = getAnExaminationCenterGetterMock();
    businessUnitGetter = getBusinessUnitGetterMock();

    getUserSpy = jest.spyOn(adminUserGetter, 'get');
    getExaminationCenterSpy = jest.spyOn(examinationCenterGetter, 'get');
    getBusinessUnitsSpy = jest.spyOn(businessUnitGetter, 'get');
    updateSpy = jest.spyOn(examinationCenterRepository, 'update');

    handler = new EditExaminationCenterHandler(
      examinationCenterRepository,
      examinationCenterGetter,
      businessUnitGetter,
      adminUserGetter,
    );
  });

  it('should edit an examination center', async () => {
    getUserSpy.mockImplementation((): Promise<AdminUser | null> => {
      return Promise.resolve(user);
    });

    getExaminationCenterSpy.mockImplementation(
      (): Promise<ExaminationCenter | null> => {
        return Promise.resolve(examinationCenter);
      },
    );

    getBusinessUnitsSpy.mockImplementation(
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
        _address: 'address',
      }),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
