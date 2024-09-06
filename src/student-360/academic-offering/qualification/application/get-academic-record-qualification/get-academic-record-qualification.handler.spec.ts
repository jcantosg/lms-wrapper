import { GetAcademicRecordQualificationHandler } from '#student-360/academic-offering/qualification/application/get-academic-record-qualification/get-academic-record-qualification.handler';
import {
  getAnAcademicRecord,
  getAnEnrollment,
  getASGAStudent,
} from '#test/entity-factory';
import { GetAcademicRecordQualificationQuery } from '#student-360/academic-offering/qualification/application/get-academic-record-qualification/get-academic-record-qualification.query';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import {
  getAnAcademicRecordGetterMock,
  getAnEnrollmentGetterMock,
} from '#test/service-factory';
import { AcademicRecordNotFoundException } from '#student/shared/exception/academic-record.not-found.exception';
import clearAllMocks = jest.clearAllMocks;

let handler: GetAcademicRecordQualificationHandler;
const academicRecord = getAnAcademicRecord();
let academicRecordGetter: AcademicRecordGetter;
const enrollments = [getAnEnrollment()];
let enrollmentGetter: EnrollmentGetter;
let getAcademicRecordSpy: jest.SpyInstance;
let getEnrollmentSpy: jest.SpyInstance;

const query = new GetAcademicRecordQualificationQuery(
  academicRecord.id,
  getASGAStudent(),
);

describe('Get Academic Record Qualification Handler', () => {
  beforeAll(() => {
    academicRecordGetter = getAnAcademicRecordGetterMock();
    enrollmentGetter = getAnEnrollmentGetterMock();
    handler = new GetAcademicRecordQualificationHandler(
      academicRecordGetter,
      enrollmentGetter,
    );
    getAcademicRecordSpy = jest.spyOn(
      academicRecordGetter,
      'getStudentAcademicRecord',
    );
    getEnrollmentSpy = jest.spyOn(enrollmentGetter, 'getByAcademicRecord');
  });
  it('should throw an AcademicRecordNotFoundException', () => {
    getAcademicRecordSpy.mockImplementation(() => {
      throw new AcademicRecordNotFoundException();
    });
    expect(handler.handle(query)).rejects.toThrow(
      AcademicRecordNotFoundException,
    );
  });
  it('should return subject calls', async () => {
    getAcademicRecordSpy.mockImplementation(() =>
      Promise.resolve(academicRecord),
    );
    getEnrollmentSpy.mockImplementation(() => Promise.resolve(enrollments));
    await handler.handle(query);
    expect(getEnrollmentSpy).toHaveBeenCalledTimes(1);
  });
  afterAll(() => {
    clearAllMocks();
  });
});
