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
import { RemoveStudentFromInternalGroupHandler } from '#student/application/remove-student-from-internal-group/remove-student-from-internal-group.handler';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { RemoveStudentFromInternalGroupCommand } from '#student/application/remove-student-from-internal-group/remove-student-from-internal-group.command';
import { StudentNotFoundException } from '#student/shared/exception/student-not-found.exception';

let handler: RemoveStudentFromInternalGroupHandler;
let repository: InternalGroupRepository;
let internalGroupGetter: InternalGroupGetter;
let studentGetter: StudentGetter;

let internalGroupGetByAdminUserSpy: jest.SpyInstance;
let getStudentSpy: jest.SpyInstance;
let saveSpy: jest.SpyInstance;

const internalGroup = getAnInternalGroup(
  getAnAcademicPeriod(),
  getAnAcademicProgram(),
  getAPeriodBlock(),
  getASubject(),
);
const student = getASGAStudent();

internalGroup.addStudents([student]);

const command = new RemoveStudentFromInternalGroupCommand(
  internalGroup.id,
  student.id,
  getAnAdminUser(),
);

describe('Remove Student from Internal Group Handler', () => {
  beforeAll(async () => {
    repository = new InternalGroupMockRepository();
    internalGroupGetter = getAInternalGroupGetterMock();
    studentGetter = getAStudentGetterMock();

    internalGroupGetByAdminUserSpy = jest.spyOn(
      internalGroupGetter,
      'getByAdminUser',
    );
    getStudentSpy = jest.spyOn(studentGetter, 'get');
    saveSpy = jest.spyOn(repository, 'save');

    handler = new RemoveStudentFromInternalGroupHandler(
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
    getStudentSpy.mockImplementation(() => {
      throw new StudentNotFoundException();
    });

    await expect(handler.handle(command)).rejects.toThrow(
      StudentNotFoundException,
    );
  });

  it('should remove a student from an internal group', async () => {
    internalGroupGetByAdminUserSpy.mockImplementation(() =>
      Promise.resolve(internalGroup),
    );
    getStudentSpy.mockImplementation(() => Promise.resolve(student));

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: internalGroup.id,
        students: [],
      }),
    );
  });
});
