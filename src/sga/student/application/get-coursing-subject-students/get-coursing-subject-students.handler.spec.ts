import {
  getASGAStudent,
  getASubject,
  getAnAcademicRecord,
  getAnAdminUser,
  getAnEnrollment,
} from '#test/entity-factory';
import {
  getASubjectGetterMock,
  getAnEnrollmentGetterMock,
} from '#test/service-factory';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { GetCoursingSubjectStudentsQuery } from '#student/application/get-coursing-subject-students/get-coursing-subject-students.query';
import { GetCoursingSubjectStudentsHandler } from '#student/application/get-coursing-subject-students/get-coursing-subject-students.handler';
import { SubjectNotFoundException } from '#shared/domain/exception/academic-offering/subject.not-found.exception';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { Enrollment } from '#student/domain/entity/enrollment.entity';

let handler: GetCoursingSubjectStudentsHandler;
let subjectGetter: SubjectGetter;
let enrollmentGetter: EnrollmentGetter;
let getSubjectSpy: jest.SpyInstance;
let getEnrollmentsSpy: jest.SpyInstance;
const subject = getASubject();
const adminUser = getAnAdminUser();
const enrollment = getAnEnrollment();
const student = getASGAStudent();
const academicRecord = getAnAcademicRecord();

academicRecord.status = AcademicRecordStatusEnum.VALID;
academicRecord.student = student;
enrollment.academicRecord = academicRecord;

const query = new GetCoursingSubjectStudentsQuery(subject.id, adminUser);

describe('Get Coursing Subject Students Handler Test', () => {
  beforeAll(() => {
    subjectGetter = getASubjectGetterMock();
    enrollmentGetter = getAnEnrollmentGetterMock();
    handler = new GetCoursingSubjectStudentsHandler(
      subjectGetter,
      enrollmentGetter,
    );
    getSubjectSpy = jest.spyOn(subjectGetter, 'getByAdminUser');
    getEnrollmentsSpy = jest.spyOn(enrollmentGetter, 'getBySubject');
  });
  it('should throw a subject not found exception', async () => {
    getSubjectSpy.mockImplementation(() => {
      throw new SubjectNotFoundException();
    });
    expect(handler.handle(query)).rejects.toThrow(SubjectNotFoundException);
  });

  it('should return a student', async () => {
    getSubjectSpy.mockImplementation(
      (): Promise<Subject> => Promise.resolve(subject),
    );

    getEnrollmentsSpy.mockImplementation(
      (): Promise<Enrollment[]> => Promise.resolve([enrollment]),
    );

    const students = await handler.handle(query);
    expect(students).toContain(student);
  });
});
