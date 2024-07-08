import { GetSubjectProgressHandler } from '#student-360/academic-offering/subject/application/get-subject-progress/get-subject-progress.handler';
import { GetLmsCourseProgressHandler } from '#lms-wrapper/application/lms-course/get-lms-course-progress/get-lms-course-progress.handler';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { GetSubjectProgressQuery } from '#student-360/academic-offering/subject/application/get-subject-progress/get-subject-progress.query';
import { getASGAStudent, getASubject } from '#test/entity-factory';
import { LmsCourseMockRepository } from '#test/mocks/lms-wrapper/lms-course.mock-repository';
import { getASubjectGetterMock } from '#test/service-factory';
import { SubjectNotFoundException } from '#shared/domain/exception/academic-offering/subject.not-found.exception';
import { getALmsCourse, getALmsStudent } from '#test/value-object-factory';
import clearAllMocks = jest.clearAllMocks;

let handler: GetSubjectProgressHandler;
let getLmsCourseProgressHandler: GetLmsCourseProgressHandler;
let subjectGetter: SubjectGetter;
let getSubjectSpy: jest.SpyInstance;
let getLmsCourseProgressHandleSpy: jest.SpyInstance;
const subject = getASubject();
subject.lmsCourse = getALmsCourse(1, 'Test');
const student = getASGAStudent();
student.lmsStudent = getALmsStudent();

const query = new GetSubjectProgressQuery(subject.id, student);

describe('Get Subject Progress Handler Test', () => {
  beforeAll(() => {
    getLmsCourseProgressHandler = new GetLmsCourseProgressHandler(
      new LmsCourseMockRepository(),
    );
    subjectGetter = getASubjectGetterMock();
    handler = new GetSubjectProgressHandler(
      subjectGetter,
      getLmsCourseProgressHandler,
    );
    getSubjectSpy = jest.spyOn(subjectGetter, 'get');
    getLmsCourseProgressHandleSpy = jest.spyOn(
      getLmsCourseProgressHandler,
      'handle',
    );
  });
  it('should throw a SubjectNotFoundException', () => {
    getSubjectSpy.mockImplementation(() => {
      throw new SubjectNotFoundException();
    });
    expect(handler.handle(query)).rejects.toThrow(SubjectNotFoundException);
  });
  it('should return a progress', async () => {
    getSubjectSpy.mockImplementation(() => Promise.resolve(subject));
    getLmsCourseProgressHandleSpy.mockImplementation(() =>
      Promise.resolve(Math.round(Math.random())),
    );
    const response = await handler.handle(query);
    expect(typeof response).toBe('number');
  });

  afterAll(() => {
    clearAllMocks();
  });
});
