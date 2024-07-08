import {
  getAnInternalGroup,
  getAnAdminUser,
  getAnAcademicPeriod,
  getAnAcademicProgram,
  getAPeriodBlock,
  getASubject,
  getASGAStudent,
} from '#test/entity-factory';
import {
  getAInternalGroupGetterMock,
  getAStudentGetterMock,
} from '#test/service-factory';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { InternalGroupGetter } from '#student/domain/service/internal-group.getter.service';
import { InternalGroupMockRepository } from '#test/mocks/sga/student/internal-group.mock-repository';
import { InternalGroupNotFoundException } from '#shared/domain/exception/internal-group/internal-group.not-found.exception';
import { AddStudentToInternalGroupHandler } from '#student/application/add-student-to-internal-group/add-student-to-internal-group.handler';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { AddStudentToInternalGroupCommand } from '#student/application/add-student-to-internal-group/add-student-to-internal-group.command';
import { StudentNotFoundException } from '#student/shared/exception/student-not-found.exception';
import { AlreadyInInternalGroupException } from '#shared/domain/exception/sga-student/already-in-internal-group.exception';

let handler: AddStudentToInternalGroupHandler;
let repository: InternalGroupRepository;
let internalGroupGetter: InternalGroupGetter;
let studentGetter: StudentGetter;

let internalGroupGetByAdminUserSpy: jest.SpyInstance;
let internalGroupGetByStudentSpy: jest.SpyInstance;
let studentGetSpy: jest.SpyInstance;
let saveSpy: jest.SpyInstance;

const internalGroup = getAnInternalGroup(
  getAnAcademicPeriod(),
  getAnAcademicProgram(),
  getAPeriodBlock(),
  getASubject(),
);
const student = getASGAStudent();

const command = new AddStudentToInternalGroupCommand(
  internalGroup.id,
  [student.id],
  getAnAdminUser(),
);

describe('Add Student to Internal Group Handler', () => {
  beforeAll(async () => {
    repository = new InternalGroupMockRepository();
    internalGroupGetter = getAInternalGroupGetterMock();
    studentGetter = getAStudentGetterMock();

    internalGroupGetByAdminUserSpy = jest.spyOn(
      internalGroupGetter,
      'getByAdminUser',
    );
    internalGroupGetByStudentSpy = jest.spyOn(
      internalGroupGetter,
      'getByStudentAndSubject',
    );
    studentGetSpy = jest.spyOn(studentGetter, 'get');
    saveSpy = jest.spyOn(repository, 'save');

    handler = new AddStudentToInternalGroupHandler(
      repository,
      internalGroupGetter,
      studentGetter,
    );
  });

  it('should throw an internal group not found', async () => {
    internalGroupGetByAdminUserSpy.mockImplementation(() => {
      throw new InternalGroupNotFoundException();
    });

    await expect(handler.handle(command)).rejects.toThrow(
      InternalGroupNotFoundException,
    );
  });

  it('should throw a student not found', async () => {
    internalGroupGetByAdminUserSpy.mockImplementation(() =>
      Promise.resolve(internalGroup),
    );
    studentGetSpy.mockImplementation(() => {
      throw new StudentNotFoundException();
    });

    await expect(handler.handle(command)).rejects.toThrow(
      StudentNotFoundException,
    );
  });

  it('should throw a student already in internal group exception', async () => {
    internalGroupGetByAdminUserSpy.mockImplementation(() =>
      Promise.resolve(internalGroup),
    );
    studentGetSpy.mockImplementation(() => Promise.resolve(student));
    internalGroupGetByStudentSpy.mockImplementation(() =>
      Promise.resolve(internalGroup),
    );

    await expect(handler.handle(command)).rejects.toThrow(
      AlreadyInInternalGroupException,
    );
  });

  it('should add a student to an internal group', async () => {
    internalGroupGetByAdminUserSpy.mockImplementation(() =>
      Promise.resolve(internalGroup),
    );
    studentGetSpy.mockImplementation(() => Promise.resolve(student));
    internalGroupGetByStudentSpy.mockImplementation(() =>
      Promise.resolve(null),
    );

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: internalGroup.id,
        students: expect.arrayContaining([student]),
      }),
    );
  });
});
