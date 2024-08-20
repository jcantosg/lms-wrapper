import {
  getAStudentGetterMock,
  getAnAcademicRecordGetterMock,
} from '#test/service-factory';
import {
  getASGAStudent,
  getAnAcademicRecord,
  getAnAdminUser,
} from '#test/entity-factory';
import { CreateAdministrativeProcessHandler } from '#student/application/administrative-process/create-administrative-process/create-administrative-process.handler';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';
import { CreateAdministrativeProcessCommand } from '#student/application/administrative-process/create-administrative-process/create-administrative-process.command';
import { AdministrativeProcessMockRepository } from '#test/mocks/sga/student/administrative-process.mock-repository';
import { StudentGetter } from '#shared/domain/service/student-getter.service';

let handler: CreateAdministrativeProcessHandler;
let administrativeProcessRepository: AdministrativeProcessRepository;
let academicRecordGetter: AcademicRecordGetter;
let studentGetter: StudentGetter;

let saveSpy: jest.SpyInstance;
let getAcademicRecordSpy: jest.SpyInstance;
let getStudentSpy: jest.SpyInstance;

const student = getASGAStudent();

const academicRecord = getAnAcademicRecord();

const command = new CreateAdministrativeProcessCommand(
  'db801d43-883a-4eaa-8a1c-339adb4a464c',
  academicRecord.id,
  student.id,
  getAnAdminUser(),
);
const commandWithoutStudent = new CreateAdministrativeProcessCommand(
  'db801d43-883a-4eaa-8a1c-339adb4a464c',
  academicRecord.id,
  null,
  getAnAdminUser(),
);
const commandWithoutAcademicRecord = new CreateAdministrativeProcessCommand(
  'db801d43-883a-4eaa-8a1c-339adb4a464c',
  null,
  student.id,
  getAnAdminUser(),
);

describe('Create Administrative Process Handler', () => {
  beforeAll(() => {
    administrativeProcessRepository = new AdministrativeProcessMockRepository();
    academicRecordGetter = getAnAcademicRecordGetterMock();
    studentGetter = getAStudentGetterMock();

    saveSpy = jest.spyOn(administrativeProcessRepository, 'save');
    getAcademicRecordSpy = jest.spyOn(academicRecordGetter, 'getByAdminUser');
    getStudentSpy = jest.spyOn(studentGetter, 'get');

    handler = new CreateAdministrativeProcessHandler(
      administrativeProcessRepository,
      academicRecordGetter,
      studentGetter,
    );
  });

  it('should save an administrative process without academicRecord', async () => {
    getAcademicRecordSpy.mockImplementation(() =>
      Promise.resolve(academicRecord),
    );
    getStudentSpy.mockImplementation(() => Promise.resolve(student));

    await handler.handle(commandWithoutAcademicRecord);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: command.id,
        _type: AdministrativeProcessTypeEnum.NEW_ACADEMIC_RECORD,
        _academicRecord: null,
        _student: student,
      }),
    );
  });

  it('should save an administrative process without student', async () => {
    getAcademicRecordSpy.mockImplementation(() =>
      Promise.resolve(academicRecord),
    );
    getStudentSpy.mockImplementation(() => Promise.resolve(student));

    await handler.handle(commandWithoutStudent);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: command.id,
        _type: AdministrativeProcessTypeEnum.NEW_ACADEMIC_RECORD,
        _academicRecord: academicRecord,
        _student: null,
      }),
    );
  });

  it('should save an administrative process', async () => {
    getAcademicRecordSpy.mockImplementation(() =>
      Promise.resolve(academicRecord),
    );
    getStudentSpy.mockImplementation(() => Promise.resolve(student));

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: command.id,
        _type: AdministrativeProcessTypeEnum.NEW_ACADEMIC_RECORD,
        _academicRecord: academicRecord,
        _student: student,
      }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
