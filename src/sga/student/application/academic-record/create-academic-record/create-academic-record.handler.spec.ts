import { CreateAcademicRecordHandler } from '#student/application/academic-record/create-academic-record/create-academic-record.handler';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { VirtualCampusGetter } from '#business-unit/domain/service/virtual-campus-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { StudentGetter } from '#student/domain/service/student-getter.service';
import { AcademicRecordMockRepository } from '#test/mocks/sga/student/academic-record.mock-repository';
import {
  getAnAcademicPeriodGetterMock,
  getAnAcademicProgramGetterMock,
  getAStudentGetterMock,
  getBusinessUnitGetterMock,
  getVirtualCampusGetterMock,
} from '#test/service-factory';
import {
  getABusinessUnit,
  getAnAcademicPeriod,
  getAnAcademicProgram,
  getAnAdminUser,
  getASGAStudent,
  getAVirtualCampus,
} from '#test/entity-factory';
import { CreateAcademicRecordCommand } from '#student/application/academic-record/create-academic-record/create-academic-record.command';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { VirtualCampusNotFoundException } from '#shared/domain/exception/business-unit/virtual-campus/virtual-campus-not-found.exception';
import { AcademicPeriodNotFoundException } from '#shared/domain/exception/academic-offering/academic-period.not-found.exception';
import { AcademicProgramNotFoundException } from '#shared/domain/exception/academic-offering/academic-program.not-found.exception';

let handler: CreateAcademicRecordHandler;
let repository: AcademicRecordRepository;
let businessUnitGetter: BusinessUnitGetter;
let virtualCampusGetter: VirtualCampusGetter;
let academicPeriodGetter: AcademicPeriodGetter;
let academicProgramGetter: AcademicProgramGetter;
let studentGetter: StudentGetter;

let saveSpy: jest.SpyInstance;
let getBusinessUnitSpy: jest.SpyInstance;
let getVirtualCampusSpy: jest.SpyInstance;
let getAcademicPeriodSpy: jest.SpyInstance;
let getAcademicProgramSpy: jest.SpyInstance;
let getStudentSpy: jest.SpyInstance;

const businessUnit = getABusinessUnit();
const virtualCampus = getAVirtualCampus();
const academicPeriod = getAnAcademicPeriod();
const academicProgram = getAnAcademicProgram();
const adminUser = getAnAdminUser();
const student = getASGAStudent();

const command = new CreateAcademicRecordCommand(
  'db801d43-883a-4eaa-8a1c-339adb4a464c',
  businessUnit.id,
  virtualCampus.id,
  student.id,
  academicPeriod.id,
  academicProgram.id,
  AcademicRecordModalityEnum.ELEARNING,
  false,
  adminUser,
);

describe('Create Academic Record Handler', () => {
  beforeAll(() => {
    repository = new AcademicRecordMockRepository();
    businessUnitGetter = getBusinessUnitGetterMock();
    virtualCampusGetter = getVirtualCampusGetterMock();
    academicPeriodGetter = getAnAcademicPeriodGetterMock();
    academicProgramGetter = getAnAcademicProgramGetterMock();
    studentGetter = getAStudentGetterMock();

    saveSpy = jest.spyOn(repository, 'save');
    getBusinessUnitSpy = jest.spyOn(businessUnitGetter, 'getByAdminUser');
    getVirtualCampusSpy = jest.spyOn(virtualCampusGetter, 'get');
    getAcademicPeriodSpy = jest.spyOn(academicPeriodGetter, 'get');
    getAcademicProgramSpy = jest.spyOn(academicProgramGetter, 'get');
    getStudentSpy = jest.spyOn(studentGetter, 'get');

    handler = new CreateAcademicRecordHandler(
      repository,
      businessUnitGetter,
      virtualCampusGetter,
      academicPeriodGetter,
      academicProgramGetter,
      studentGetter,
    );
  });

  it('should return 404 virtual campus not found', async () => {
    getBusinessUnitSpy.mockImplementation(() => Promise.resolve(businessUnit));
    getVirtualCampusSpy.mockImplementation(() =>
      Promise.resolve(virtualCampus),
    );

    await expect(handler.handle(command)).rejects.toThrow(
      VirtualCampusNotFoundException,
    );
  });

  it('should return 404 academic period not found', async () => {
    getBusinessUnitSpy.mockImplementation(() => Promise.resolve(businessUnit));
    getVirtualCampusSpy.mockImplementation(() =>
      Promise.resolve(virtualCampus),
    );
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );

    virtualCampus.businessUnit = businessUnit;
    await expect(handler.handle(command)).rejects.toThrow(
      AcademicPeriodNotFoundException,
    );
  });

  it('should return 404 academic program not found', async () => {
    getBusinessUnitSpy.mockImplementation(() => Promise.resolve(businessUnit));
    getVirtualCampusSpy.mockImplementation(() =>
      Promise.resolve(virtualCampus),
    );
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );

    virtualCampus.businessUnit = businessUnit;
    academicPeriod.businessUnit = businessUnit;
    academicPeriod.academicPrograms = [academicProgram];

    await expect(handler.handle(command)).rejects.toThrow(
      AcademicProgramNotFoundException,
    );
  });

  it('should save an academic record', async () => {
    getBusinessUnitSpy.mockImplementation(() => Promise.resolve(businessUnit));
    getVirtualCampusSpy.mockImplementation(() =>
      Promise.resolve(virtualCampus),
    );
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    getStudentSpy.mockImplementation(() => Promise.resolve(student));

    academicProgram.businessUnit = businessUnit;

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: command.id,
        _businessUnit: businessUnit,
        _virtualCampus: virtualCampus,
        _academicPeriod: academicPeriod,
        _academicProgram: academicProgram,
        _student: student,
        _modality: command.academicRecordModality,
        _isModular: command.isModular,
        _createdBy: command.adminUser,
      }),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
