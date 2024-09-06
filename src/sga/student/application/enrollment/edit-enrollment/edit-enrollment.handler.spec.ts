import { EditEnrollmentHandler } from '#student/application/enrollment/edit-enrollment/edit-enrollment.handler';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { getAnAcademicRecord, getAnEnrollment } from '#test/entity-factory';
import { getAnEnrollmentGetterMock } from '#test/service-factory';
import { EnrollmentMockRepository } from '#test/mocks/sga/student/enrollment.mock-repository';
import { EditEnrollmentCommand } from '#student/application/enrollment/edit-enrollment/edit-enrollment.command';
import { EnrollmentTypeEnum } from '#student/domain/enum/enrollment/enrollment-type.enum';
import { EnrollmentVisibilityEnum } from '#student/domain/enum/enrollment/enrollment-visibility.enum';
import { EnrollmentNotFoundException } from '#student/shared/exception/enrollment-not-found.exception';
import clearAllMocks = jest.clearAllMocks;
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { AcademicRecordCancelledException } from '#shared/domain/exception/sga-student/academic-record-cancelled.exception';

let handler: EditEnrollmentHandler;
let enrollmentGetter: EnrollmentGetter;
let repository: EnrollmentRepository;
let getSpy: jest.SpyInstance;
let saveSpy: jest.SpyInstance;
const enrollment = getAnEnrollment();
enrollment.academicRecord = getAnAcademicRecord();
const command = new EditEnrollmentCommand(
  enrollment.id,
  EnrollmentTypeEnum.UNIVERSAE,
  EnrollmentVisibilityEnum.PD,
  4,
);

describe('Edit Enrollment Handler Unit Test', () => {
  beforeAll(() => {
    enrollmentGetter = getAnEnrollmentGetterMock();
    repository = new EnrollmentMockRepository();
    handler = new EditEnrollmentHandler(repository, enrollmentGetter);
    getSpy = jest.spyOn(enrollmentGetter, 'get');
    saveSpy = jest.spyOn(repository, 'save');
  });

  it('should throw an error if the academic record is cancelled', async () => {
    getSpy.mockImplementation(() => {
      enrollment.academicRecord.status = AcademicRecordStatusEnum.CANCELLED;

      return Promise.resolve(enrollment);
    });
    await expect(handler.handle(command)).rejects.toThrow(
      AcademicRecordCancelledException,
    );
  });

  it('should update an enrollment', async () => {
    getSpy.mockImplementation(() => Promise.resolve(enrollment));
    enrollment.academicRecord.status = AcademicRecordStatusEnum.VALID;

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: enrollment.id,
        maxCalls: command.maxCalls,
        visibility: command.visibility,
        type: command.type,
      }),
    );
  });
  it('should throw an EnrollmentNotFoundException', () => {
    getSpy.mockImplementation(() => {
      throw new EnrollmentNotFoundException();
    });
    expect(handler.handle(command)).rejects.toThrow(
      EnrollmentNotFoundException,
    );
  });

  afterAll(() => {
    clearAllMocks();
  });
});
