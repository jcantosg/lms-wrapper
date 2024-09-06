import { GetSubjectHandler } from '#student-360/academic-offering/subject/application/get-subject/get-subject.handler';
import {
  getAnAcademicProgram,
  getAnAcademicRecord,
  getAnEdaeUser,
  getAProgramBlock,
  getASGAStudent,
  getASubject,
} from '#test/entity-factory';
import { GetSubjectQuery } from '#student-360/academic-offering/subject/application/get-subject/get-subject.query';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import {
  getAnAcademicRecordGetterMock,
  getAnInternalGroupDefaultTeacherGetterMock,
  getASubjectGetterMock,
} from '#test/service-factory';
import { StudentSubjectNotFoundException } from '#shared/domain/exception/student-360/student-subject-not-found.exception';
import { InternalGroupDefaultTeacherGetter } from '#student/domain/service/internal-group-default-teacher-getter.service';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { getALmsCourse, getALmsStudent } from '#test/value-object-factory';
import { GetLmsCourseWithQuizzesHandler } from '#lms-wrapper/application/get-lms-course-with-quizzes/get-lms-course-with-quizzes.handler';
import { LmsCourseMockRepository } from '#test/mocks/lms-wrapper/lms-course.mock-repository';

let handler: GetSubjectHandler;
const student = getASGAStudent();
student.lmsStudent = getALmsStudent();
let subject = getASubject();
subject.lmsCourse = getALmsCourse(1, 'test');
const academicRecord = getAnAcademicRecord();
const academicProgram = getAnAcademicProgram();
const programBlock = getAProgramBlock();
let subjectGetter: SubjectGetter;
let academicRecordGetter: AcademicRecordGetter;
let internalGroupDefaultTeacher: InternalGroupDefaultTeacherGetter;
let getLmsCourseWithQuizzesHandler: GetLmsCourseWithQuizzesHandler;
let getSubjectSpy: jest.SpyInstance;
let getDefaultTeacherSpy: jest.SpyInstance;
let getAcademicRecordSpy: jest.SpyInstance;
let getCourseSpy: jest.SpyInstance;

const query = new GetSubjectQuery(subject.id, student, academicRecord.id);

describe('Get Subject Handler Unit Test', () => {
  beforeAll(() => {
    subjectGetter = getASubjectGetterMock();
    internalGroupDefaultTeacher = getAnInternalGroupDefaultTeacherGetterMock();
    academicRecordGetter = getAnAcademicRecordGetterMock();
    getLmsCourseWithQuizzesHandler = new GetLmsCourseWithQuizzesHandler(
      new LmsCourseMockRepository(),
    );
    handler = new GetSubjectHandler(
      subjectGetter,
      internalGroupDefaultTeacher,
      academicRecordGetter,
      getLmsCourseWithQuizzesHandler,
    );
    getSubjectSpy = jest.spyOn(subjectGetter, 'get');
    getDefaultTeacherSpy = jest.spyOn(internalGroupDefaultTeacher, 'get');
    getAcademicRecordSpy = jest.spyOn(academicRecordGetter, 'get');
    getCourseSpy = jest.spyOn(getLmsCourseWithQuizzesHandler, 'handle');
  });

  it('should return a subject', async () => {
    programBlock.subjects.push(subject);
    academicProgram.programBlocks.push(programBlock);
    academicRecord.academicProgram = academicProgram;
    student.academicRecords.push(academicRecord);
    getSubjectSpy.mockImplementation(() => Promise.resolve(subject));
    getDefaultTeacherSpy.mockImplementation(() =>
      Promise.resolve(getAnEdaeUser()),
    );
    getAcademicRecordSpy.mockImplementation(() =>
      Promise.resolve(academicRecord),
    );
    getCourseSpy.mockImplementation(() =>
      Promise.resolve(getALmsCourse(1, 'test')),
    );
    const response = await handler.handle(query);
    expect(response).toEqual(expect.objectContaining({ subject: subject }));
  });
  it('should throw a SubjectNotFoundException', () => {
    subject = getASubject();

    getSubjectSpy.mockImplementation(() => Promise.resolve(subject));
    expect(handler.handle(query)).rejects.toThrow(
      StudentSubjectNotFoundException,
    );
  });
});
