import { UpdateStudentPasswordHandler } from '#student/application/update-password/update-student-password.handler';
import { StudentRepository } from '#shared/domain/repository/student.repository';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { getAnAdminUser, getASGAStudent } from '#test/entity-factory';
import { StudentMockRepository } from '#test/mocks/sga/student/student.mock-repository';
import {
  getAStudentGetterMock,
  PasswordEncoderMock,
  PasswordFormatCheckerMock,
} from '#test/service-factory';
import { EventDispatcherMock } from '#test/mocks/shared/event-dispatcher.mock-service';
import { UpdateStudentPasswordCommand } from '#student/application/update-password/update-student-password.command';
import { StudentNotFoundException } from '#student/shared/exception/student-not-found.exception';
import { PasswordFormatChecker } from '#admin-user/domain/service/password-format-checker.service';

let handler: UpdateStudentPasswordHandler;
let repository: StudentRepository;
let studentGetter: StudentGetter;
let passwordGenerator: PasswordEncoder;
let passwordFormatChecker: PasswordFormatChecker;
let eventDispatcher: EventDispatcher;
let saveSpy: jest.SpyInstance;
let getSpy: jest.SpyInstance;
let encodePasswordSpy: jest.SpyInstance;
let dispatchSpy: jest.SpyInstance;

const student = getASGAStudent();
const admin = getAnAdminUser();

const command = new UpdateStudentPasswordCommand(
  student.id,
  'nuevoPassword',
  admin,
);

describe('Update Student Password Handler', () => {
  repository = new StudentMockRepository();
  studentGetter = getAStudentGetterMock();
  passwordGenerator = new PasswordEncoderMock();
  passwordFormatChecker = new PasswordFormatCheckerMock();
  eventDispatcher = new EventDispatcherMock();
  handler = new UpdateStudentPasswordHandler(
    studentGetter,
    repository,
    passwordGenerator,
    passwordFormatChecker,
    eventDispatcher,
  );
  saveSpy = jest.spyOn(repository, 'save');
  getSpy = jest.spyOn(studentGetter, 'get');
  encodePasswordSpy = jest.spyOn(passwordGenerator, 'encodePassword');
  dispatchSpy = jest.spyOn(eventDispatcher, 'dispatch');

  it('should throw a StudentNotFoundException', () => {
    getSpy.mockImplementation(() => {
      throw new StudentNotFoundException();
    });
    expect(handler.handle(command)).rejects.toThrow(StudentNotFoundException);
  });
  it('should update a password', async () => {
    getSpy.mockImplementation(() => Promise.resolve(student));
    encodePasswordSpy.mockImplementation(() => Promise.resolve('newPassword'));
    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });
});
