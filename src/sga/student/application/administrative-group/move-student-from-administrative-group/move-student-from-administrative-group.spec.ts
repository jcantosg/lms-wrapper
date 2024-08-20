import { MoveStudentFromAdministrativeGroupHandler } from './move-student-from-administrative-group.handler';
import { MoveStudentFromAdministrativeGroupCommand } from './move-student-from-administrative-group.command';
import { AdministrativeGroupGetter } from '#student/domain/service/administrative-group.getter.service';
import { StudentRepository } from '#shared/domain/repository/student.repository';
import {
  getAnAdminUser,
  getAnAdministrativeGroup,
  getASGAStudent,
  getAnAcademicRecord,
  getAnEnrollment,
} from '#test/entity-factory';
import { v4 as uuid } from 'uuid';
import clearAllMocks = jest.clearAllMocks;
import {
  getAnAdministrativeGroupGetterMock,
  getAnEnrollmentGetterMock,
  getAUpdateInternalGroupsServiceMock,
} from '#test/service-factory';
import { StudentMockRepository } from '#test/mocks/sga/student/student.mock-repository';
import { AdministrativeGroupNotFoundException } from '#shared/domain/exception/administrative-group/administrative-group.not-found.exception';
import { StudentNotFoundException } from '#student/shared/exception/student-not-found.exception';
import { TransactionalService } from '#shared/domain/service/transactional-service.service';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { UpdateInternalGroupsService } from '#student/domain/service/update-internal-groups.service';
import { TransactionalServiceMock } from '#test/mocks/shared/transactional-service-mock';
import { AcademicRecordMockRepository } from '#test/mocks/sga/student/academic-record.mock-repository';

let handler: MoveStudentFromAdministrativeGroupHandler;
let studentRepository: StudentRepository;
let administrativeGroupGetter: AdministrativeGroupGetter;
let transactionalService: TransactionalService;
let academicRecordRepository: AcademicRecordRepository;
let enrollmentGetter: EnrollmentGetter;
let updateInternalGroupsService: UpdateInternalGroupsService;

let getAdministrativeGroupSpy: jest.SpyInstance;
let getStudentSpy: jest.SpyInstance;
let getStudentAcademicRecordSpy: jest.SpyInstance;
let getEnrollmentByAcademicRecordSpy: jest.SpyInstance;
let executeTransactionSpy: jest.SpyInstance;
let updateInternalGroupsServiceSpy: jest.SpyInstance;

const student1 = getASGAStudent();
student1.id = uuid();
const student2 = getASGAStudent();
student2.id = uuid();
const student3 = getASGAStudent();
student3.id = uuid();
const students = [student1, student2, student3];

const originGroup = getAnAdministrativeGroup();
originGroup.id = 'originGroupId';
originGroup.students = students;

const destinationGroup = getAnAdministrativeGroup();
destinationGroup.id = 'destinationGroupId';

const academicRecord = getAnAcademicRecord();
const enrollment = getAnEnrollment();

const command = new MoveStudentFromAdministrativeGroupCommand(
  students.map((student) => student.id),
  originGroup.id,
  destinationGroup.id,
  getAnAdminUser(),
);

describe('MoveStudentFromAdministrativeGroupHandler', () => {
  beforeAll(async () => {
    studentRepository = new StudentMockRepository();
    administrativeGroupGetter = getAnAdministrativeGroupGetterMock();
    transactionalService = new TransactionalServiceMock();
    academicRecordRepository = new AcademicRecordMockRepository();
    enrollmentGetter = getAnEnrollmentGetterMock();
    updateInternalGroupsService = getAUpdateInternalGroupsServiceMock();

    getStudentSpy = jest.spyOn(studentRepository, 'get');
    getAdministrativeGroupSpy = jest.spyOn(
      administrativeGroupGetter,
      'getByAdminUser',
    );
    executeTransactionSpy = jest.spyOn(transactionalService, 'execute');
    getStudentAcademicRecordSpy = jest.spyOn(
      academicRecordRepository,
      'getStudentAcademicRecordByPeriodAndProgram',
    );
    getEnrollmentByAcademicRecordSpy = jest.spyOn(
      enrollmentGetter,
      'getByAcademicRecord',
    );
    updateInternalGroupsServiceSpy = jest.spyOn(
      updateInternalGroupsService,
      'update',
    );

    handler = new MoveStudentFromAdministrativeGroupHandler(
      studentRepository,
      administrativeGroupGetter,
      transactionalService,
      academicRecordRepository,
      enrollmentGetter,
      updateInternalGroupsService,
    );
  });

  it('should move students from one administrative group to another', async () => {
    getAdministrativeGroupSpy.mockImplementation((id) =>
      Promise.resolve(id === originGroup.id ? originGroup : destinationGroup),
    );
    getStudentSpy.mockImplementation((id) =>
      Promise.resolve(students.find((student) => student.id === id)),
    );

    getStudentAcademicRecordSpy.mockImplementation(() =>
      Promise.resolve(academicRecord),
    );

    getEnrollmentByAcademicRecordSpy.mockImplementation(() =>
      Promise.resolve([enrollment]),
    );

    updateInternalGroupsServiceSpy.mockImplementation(() =>
      Promise.resolve([]),
    );

    await handler.handle(command);

    expect(executeTransactionSpy).toHaveBeenCalledTimes(students.length);
  });

  it('should throw AdministrativeGroupNotFoundException', async () => {
    getAdministrativeGroupSpy.mockImplementation((id) => {
      if (id === originGroup.id) {
        throw new AdministrativeGroupNotFoundException();
      }

      return Promise.resolve(destinationGroup);
    });

    const invalidCommand = new MoveStudentFromAdministrativeGroupCommand(
      students.map((student) => student.id),
      originGroup.id,
      destinationGroup.id,
      getAnAdminUser(),
    );

    await expect(handler.handle(invalidCommand)).rejects.toThrow(
      AdministrativeGroupNotFoundException,
    );
  });

  it('should throw StudentNotFoundException if any student is not found', async () => {
    const invalidStudentId = uuid();
    const invalidCommand = new MoveStudentFromAdministrativeGroupCommand(
      [...students.map((student) => student.id), invalidStudentId],
      originGroup.id,
      destinationGroup.id,
      getAnAdminUser(),
    );

    getAdministrativeGroupSpy.mockImplementation((id) =>
      Promise.resolve(id === originGroup.id ? originGroup : destinationGroup),
    );
    getStudentSpy.mockImplementation((id) =>
      Promise.resolve(students.find((student) => student.id === id) || null),
    );

    await expect(handler.handle(invalidCommand)).rejects.toThrow(
      StudentNotFoundException,
    );
  });

  afterAll(() => {
    clearAllMocks();
  });
});
