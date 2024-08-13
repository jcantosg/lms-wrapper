import { StudentRepository } from '#shared/domain/repository/student.repository';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { getASGAStudent } from '#test/entity-factory';
import { StudentMockRepository } from '#test/mocks/sga/student/student.mock-repository';
import {
  getAStudentGetterMock,
  getCountryGetterMock,
  getImageUploaderMock,
} from '#test/service-factory';
import { StudentDuplicatedEmailException } from '#student/shared/exception/student-duplicated-email.exception';
import { UpdateProfileCommand } from '#student-360/student/application/update-profile/update-profile.command';
import { StudentGender } from '#shared/domain/enum/student-gender.enum';
import { UpdateProfileHandler } from '#student-360/student/application/update-profile/update-profile.handler';
import { BCryptPasswordEncoder } from '#shared/infrastructure/service/bcrypt-password-encoder.service';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import { BcryptStudentPasswordChecker } from '#student-360/student/infrastructure/service/bcrypt-student-password-checker.service';
import clearAllMocks = jest.clearAllMocks;

let handler: UpdateProfileHandler;
let repository: StudentRepository;
let studentGetter: StudentGetter;
let countryGetter: CountryGetter;
let imageUploader: ImageUploader;
let passwordEncoder: PasswordEncoder;

let saveSpy: jest.SpyInstance;
let getStudentSpy: jest.SpyInstance;
let existsByEmailSpy: jest.SpyInstance;

const student = getASGAStudent();

const command = new UpdateProfileCommand(
  student.id,
  'test',
  'test',
  'test',
  'test@test.org',
  null,
  null,
  null,
  new Date(),
  StudentGender.OTHER,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
);

describe('Update Student Profile Handler', () => {
  beforeAll(() => {
    repository = new StudentMockRepository();
    studentGetter = getAStudentGetterMock();
    countryGetter = getCountryGetterMock();
    imageUploader = getImageUploaderMock();
    passwordEncoder = new BCryptPasswordEncoder();
    const studentPasswordChecker = new BcryptStudentPasswordChecker();
    handler = new UpdateProfileHandler(
      repository,
      studentGetter,
      countryGetter,
      imageUploader,
      passwordEncoder,
      studentPasswordChecker,
    );
    saveSpy = jest.spyOn(repository, 'save');
    existsByEmailSpy = jest.spyOn(repository, 'existsByEmail');
    getStudentSpy = jest.spyOn(studentGetter, 'get');
  });
  it('should update a student', async () => {
    existsByEmailSpy.mockImplementation(() => Promise.resolve(false));
    getStudentSpy.mockImplementation(() => Promise.resolve(student));
    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: student.id,
        name: command.name,
        surname: command.surname,
        surname2: command.surname2,
        email: command.email,
      }),
    );
  });
  it('should throw StudentDuplicatedEmailException', async () => {
    existsByEmailSpy.mockImplementation(() => Promise.resolve(true));
    await expect(handler.handle(command)).rejects.toThrow(
      StudentDuplicatedEmailException,
    );
  });

  afterAll(() => {
    clearAllMocks();
  });
});
