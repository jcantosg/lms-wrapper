import { CreateStudentHandler } from '#student/application/create-student/create-student.handler';
import { StudentRepository } from '#/student-360/student/domain/repository/student.repository';
import { CreateStudentCommand } from '#student/application/create-student/create-student.command';
import { v4 as uuid } from 'uuid';
import { StudentMockRepository } from '#test/mocks/sga/student/student.mock-repository';
import { StudentDuplicatedException } from '#student/shared/exception/student-duplicated.exception';
import { StudentDuplicatedEmailException } from '#student/shared/exception/student-duplicated-email.exception';
import { StudentDuplicatedUniversaeEmailException } from '#student/shared/exception/student-duplicated-universae-email.exception';
import { getAnAdminUser } from '#test/entity-factory';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import { PasswordEncoderMock } from '#test/service-factory';
import clearAllMocks = jest.clearAllMocks;
import { TransactionalService } from '#shared/domain/service/transactional-service.service';
import { TransactionalServiceMock } from '#test/mocks/shared/transactional-service-mock';

let handler: CreateStudentHandler;
let repository: StudentRepository;
let executeSpy: jest.SpyInstance;
let existsByIdSpy: jest.SpyInstance;
let existsByEmailSpy: jest.SpyInstance;
let existsByUniversaeSpy: jest.SpyInstance;
let passwordEncoder: PasswordEncoder;
let transactionalService: TransactionalService;

const command = new CreateStudentCommand(
  uuid(),
  'name',
  'surname',
  'surname',
  'test@test.org',
  'test@universae.com',
  getAnAdminUser(),
);
describe('Create Student Handler Test', () => {
  beforeAll(() => {
    repository = new StudentMockRepository();
    passwordEncoder = new PasswordEncoderMock();
    transactionalService = new TransactionalServiceMock();
    handler = new CreateStudentHandler(
      repository,
      passwordEncoder,
      transactionalService,
    );
    executeSpy = jest.spyOn(transactionalService, 'execute');
    existsByIdSpy = jest.spyOn(repository, 'existsById');
    existsByEmailSpy = jest.spyOn(repository, 'existsByEmail');
    existsByUniversaeSpy = jest.spyOn(repository, 'existsByUniversaeEmail');
  });

  it('should save a student', async () => {
    existsByIdSpy.mockImplementation(() => Promise.resolve(false));
    existsByEmailSpy.mockImplementation(() => Promise.resolve(false));
    existsByUniversaeSpy.mockImplementation(() => Promise.resolve(false));
    await handler.handle(command);
    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(executeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        student: expect.objectContaining({
          id: command.id,
          name: command.name,
          surname: command.surname,
          surname2: command.surname2,
          email: command.email,
          universaeEmail: command.universaeEmail,
        }),
      }),
    );
  });
  it('should throw a StudentDuplicatedError', async () => {
    existsByIdSpy.mockImplementation(() => Promise.resolve(true));
    await expect(handler.handle(command)).rejects.toThrow(
      StudentDuplicatedException,
    );
  });
  it('should throw a StudentDuplicatedEmailError', async () => {
    existsByIdSpy.mockImplementation(() => Promise.resolve(false));

    existsByEmailSpy.mockImplementation(() => Promise.resolve(true));
    await expect(handler.handle(command)).rejects.toThrow(
      StudentDuplicatedEmailException,
    );
  });
  it('should throw a StudentDuplicatedEmailError', async () => {
    existsByIdSpy.mockImplementation(() => Promise.resolve(false));

    existsByEmailSpy.mockImplementation(() => Promise.resolve(false));
    existsByUniversaeSpy.mockImplementation(() => Promise.resolve(true));
    await expect(handler.handle(command)).rejects.toThrow(
      StudentDuplicatedUniversaeEmailException,
    );
  });

  afterAll(() => {
    clearAllMocks();
  });
});
