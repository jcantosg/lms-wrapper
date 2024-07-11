import { MoveStudentFromAdministrativeGroupHandler } from './move-student-from-administrative-group.handler';
import { MoveStudentFromAdministrativeGroupCommand } from './move-student-from-administrative-group.command';
import { AdministrativeGroupGetter } from '#student/domain/service/administrative-group.getter.service';
import { AdministrativeGroupMockRepository } from '#test/mocks/sga/student/administrative-group.mock-repository';
import { StudentRepository } from '#student-360/student/domain/repository/student.repository';
import {
  getAnAdminUser,
  getAnAdministrativeGroup,
  getASGAStudent,
} from '#test/entity-factory';
import { v4 as uuid } from 'uuid';
import clearAllMocks = jest.clearAllMocks;
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { getAnAdministrativeGroupGetterMock } from '#test/service-factory';
import { StudentMockRepository } from '#test/mocks/sga/student/student.mock-repository';
import { AdministrativeGroupNotFoundException } from '#shared/domain/exception/administrative-group/administrative-group.not-found.exception';
import { StudentNotFoundException } from '#student/shared/exception/student-not-found.exception';

let handler: MoveStudentFromAdministrativeGroupHandler;
let studentRepository: StudentRepository;
let administrativeGroupRepository: AdministrativeGroupRepository;
let administrativeGroupGetter: AdministrativeGroupGetter;

let moveStudentsSpy: jest.SpyInstance;
let getAdministrativeGroupSpy: jest.SpyInstance;
let getStudentSpy: jest.SpyInstance;

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

const command = new MoveStudentFromAdministrativeGroupCommand(
  students.map((student) => student.id),
  originGroup.id,
  destinationGroup.id,
  getAnAdminUser(),
);

describe('MoveStudentFromAdministrativeGroupHandler', () => {
  beforeAll(async () => {
    administrativeGroupRepository = new AdministrativeGroupMockRepository();
    administrativeGroupGetter = getAnAdministrativeGroupGetterMock();
    studentRepository = new StudentMockRepository();
    handler = new MoveStudentFromAdministrativeGroupHandler(
      studentRepository,
      administrativeGroupRepository,
      administrativeGroupGetter,
    );

    moveStudentsSpy = jest.spyOn(administrativeGroupRepository, 'moveStudents');
    getAdministrativeGroupSpy = jest.spyOn(
      administrativeGroupGetter,
      'getByAdminUser',
    );
    getStudentSpy = jest.spyOn(studentRepository, 'get');
  });

  it('should move students from one administrative group to another', async () => {
    getAdministrativeGroupSpy.mockImplementation((id) =>
      Promise.resolve(id === originGroup.id ? originGroup : destinationGroup),
    );
    getStudentSpy.mockImplementation((id) =>
      Promise.resolve(students.find((student) => student.id === id)),
    );

    await handler.handle(command);

    expect(moveStudentsSpy).toHaveBeenCalledTimes(1);
    expect(moveStudentsSpy).toHaveBeenCalledWith(
      students,
      originGroup,
      destinationGroup,
    );
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
