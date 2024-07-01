import { GetLmsCourseContentHandler } from '#/lms-wrapper/application/get-lms-course-content/get-lms-course-content.handler';
import { getASubject } from '#test/entity-factory';
import { GetLmsCourseContentQuery } from '#/lms-wrapper/application/get-lms-course-content/get-lms-course-content.query';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { getASubjectGetterMock } from '#test/service-factory';
import { LmsCourseMockRepository } from '#test/mocks/lms-wrapper/lms-course.mock-repository';
import { SubjectNotFoundException } from '#shared/domain/exception/academic-offering/subject.not-found.exception';
import { getALmsContentModule } from '#test/value-object-factory';
import { LmsCourse } from '#/lms-wrapper/domain/entity/lms-course';
import { LmsCourseCategoryEnum } from '#/lms-wrapper/domain/enum/lms-course-category.enum';
import clearAllMocks = jest.clearAllMocks;

let handler: GetLmsCourseContentHandler;
let subjectGetter: SubjectGetter;
let lmsCourseRepository: LmsCourseRepository;
const subject = getASubject();
subject.lmsCourse = new LmsCourse({
  id: 2,
  categoryId: LmsCourseCategoryEnum.MIXED,
  name: 'test',
  shortname: 'test',
  modules: [],
});
const query = new GetLmsCourseContentQuery(subject.id, 56);
const lmsCourseContentResponse = [
  getALmsContentModule(),
  getALmsContentModule(),
];
let getSubjectSpy: jest.SpyInstance;
let getCourseContentSpy: jest.SpyInstance;

describe('GetLMSCourseContentHandler', () => {
  beforeAll(() => {
    subjectGetter = getASubjectGetterMock();
    lmsCourseRepository = new LmsCourseMockRepository();
    handler = new GetLmsCourseContentHandler(
      subjectGetter,
      lmsCourseRepository,
    );
    getSubjectSpy = jest.spyOn(subjectGetter, 'get');
    getCourseContentSpy = jest.spyOn(lmsCourseRepository, 'getContent');
  });
  it('should throw a SubjectNotFoundException', () => {
    getSubjectSpy.mockImplementation(() => {
      throw new SubjectNotFoundException();
    });
    expect(handler.handle(query)).rejects.toThrow(SubjectNotFoundException);
  });
  it('should return a lms course content', async () => {
    getSubjectSpy.mockImplementation(() => Promise.resolve(subject));
    getCourseContentSpy.mockImplementation(() =>
      Promise.resolve(lmsCourseContentResponse),
    );
    const response = await handler.handle(query);
    expect(response).toBe(lmsCourseContentResponse);
  });

  afterAll(() => {
    clearAllMocks();
  });
});