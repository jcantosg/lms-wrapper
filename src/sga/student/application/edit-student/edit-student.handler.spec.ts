import { EditStudentHandler } from '#student/application/edit-student/edit-student.handler';
import { StudentRepository } from '#/student-360/student/domain/repository/student.repository';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { getAnAdminUser, getASGAStudent } from '#test/entity-factory';
import { EditStudentCommand } from '#student/application/edit-student/edit-student.command';
import { StudentMockRepository } from '#test/mocks/sga/student/student.mock-repository';
import {
  getAStudentGetterMock,
  getCountryGetterMock,
  getImageUploaderMock,
} from '#test/service-factory';
import { StudentDuplicatedEmailException } from '#student/shared/exception/student-duplicated-email.exception';
import clearAllMocks = jest.clearAllMocks;

let handler: EditStudentHandler;
let repository: StudentRepository;
let studentGetter: StudentGetter;
let countryGetter: CountryGetter;
let imageUploader: ImageUploader;

let saveSpy: jest.SpyInstance;
let getStudentSpy: jest.SpyInstance;
let existsByEmailSpy: jest.SpyInstance;

const student = getASGAStudent();

const command = new EditStudentCommand(
  student.id,
  'test',
  'test',
  'test',
  'test@test.org',
  'test@universae.com',
  true,
  getAnAdminUser(),
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
  null,
  null,
  null,
  null,
  null,
  null,
  false,
);

describe('Edit Student Handler', () => {
  beforeAll(() => {
    repository = new StudentMockRepository();
    studentGetter = getAStudentGetterMock();
    countryGetter = getCountryGetterMock();
    imageUploader = getImageUploaderMock();
    handler = new EditStudentHandler(
      repository,
      studentGetter,
      countryGetter,
      imageUploader,
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
        universaeEmail: command.universaeEmail,
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
