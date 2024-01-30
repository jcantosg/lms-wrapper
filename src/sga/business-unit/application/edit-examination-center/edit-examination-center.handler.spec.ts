import {
  getABusinessUnit,
  getAnAdminUser,
  getAnExaminationCenter,
} from '#test/entity-factory';
import { ExaminationCenterMockRepository } from '#test/mocks/sga/business-unit/examination-center.mock-repository';
import {
  getAClassroomGetterMock,
  getAnExaminationCenterGetterMock,
  getBusinessUnitGetterMock,
} from '#test/service-factory';
import { v4 as uuid } from 'uuid';
import { EditExaminationCenterHandler } from './edit-examination-center.handler';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { EditExaminationCenterCommand } from './edit-examination-center.command';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { ClassroomGetter } from '#business-unit/domain/service/classroom-getter.service';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

let handler: EditExaminationCenterHandler;
let examinationCenterRepository: ExaminationCenterRepository;
let examinationCenterGetter: ExaminationCenterGetter;
let businessUnitGetter: BusinessUnitGetter;
let classroomGetter: ClassroomGetter;

let updateSpy: any;
let getExaminationCenterSpy: any;
let getBusinessUnitsSpy: any;

const businessUnit = getABusinessUnit();

const user = getAnAdminUser();
const command = new EditExaminationCenterCommand(
  uuid(),
  'name',
  'code',
  'address',
  [businessUnit.id],
  user,
  true,
  [],
);

const examinationCenter = getAnExaminationCenter(command.id);

user.addBusinessUnit(businessUnit);

describe('Edit Examination Center Handler', () => {
  beforeAll(() => {
    examinationCenterRepository = new ExaminationCenterMockRepository();
    examinationCenterGetter = getAnExaminationCenterGetterMock();
    businessUnitGetter = getBusinessUnitGetterMock();
    classroomGetter = getAClassroomGetterMock();

    getExaminationCenterSpy = jest.spyOn(examinationCenterGetter, 'get');
    getBusinessUnitsSpy = jest.spyOn(businessUnitGetter, 'get');
    updateSpy = jest.spyOn(examinationCenterRepository, 'update');

    handler = new EditExaminationCenterHandler(
      examinationCenterRepository,
      examinationCenterGetter,
      businessUnitGetter,
      classroomGetter,
    );
  });

  it('should edit an examination center', async () => {
    getExaminationCenterSpy.mockImplementation(
      (): Promise<ExaminationCenter | null> => {
        return Promise.resolve(examinationCenter);
      },
    );

    getBusinessUnitsSpy.mockImplementation((): Promise<BusinessUnit | null> => {
      return Promise.resolve(businessUnit);
    });

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
