import { getALmsCourse } from '#test/value-object-factory';
import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { LmsCourseMockRepository } from '#test/mocks/lms-wrapper/lms-course.mock-repository';
import { GetLmsCourseHandler } from '#/lms-wrapper/application/lms-course/get-lms-course/get-lms-course.handler';
import { GetLMSCourseQuery } from '#/lms-wrapper/application/lms-course/get-lms-course/get-lms-course.query';
import clearAllMocks = jest.clearAllMocks;

let handler: GetLmsCourseHandler;
const course = getALmsCourse(Math.random(), 'Curso');
let repository: LmsCourseRepository;
let getSpy: jest.SpyInstance;

describe('Get LMS Course Handler Test', () => {
  beforeAll(() => {
    repository = new LmsCourseMockRepository();
    handler = new GetLmsCourseHandler(repository);
    getSpy = jest.spyOn(repository, 'getOne');
  });
  it('should return a lms course', async () => {
    getSpy.mockImplementation(() => Promise.resolve(course));
    const response = await handler.handle(new GetLMSCourseQuery(123));
    expect(response).toBe(course);
    expect(getSpy).toHaveBeenCalledTimes(1);
  });
  afterAll(() => {
    clearAllMocks();
  });
});
