import { getALmsCourse } from '#test/value-object-factory';
import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { LmsCourseMockRepository } from '#test/mocks/lms-wrapper/lms-course.mock-repository';
import { GetLmsCourseByNameHandler } from '#/lms-wrapper/application/get-lms-course-by-name/get-lms-course-by-name.handler';
import { GetLMSCourseByNameQuery } from '#/lms-wrapper/application/get-lms-course-by-name/get-lms-course-by-name.query';
import clearAllMocks = jest.clearAllMocks;

let handler: GetLmsCourseByNameHandler;
const course = getALmsCourse(Math.random(), 'Curso');
let repository: LmsCourseRepository;
let getSpy: jest.SpyInstance;

describe('Get LMS Course Handler Test', () => {
  beforeAll(() => {
    repository = new LmsCourseMockRepository();
    handler = new GetLmsCourseByNameHandler(repository);
    getSpy = jest.spyOn(repository, 'getByName');
  });
  it('should return a lms course', async () => {
    getSpy.mockImplementation(() => Promise.resolve(course));
    const response = await handler.handle(
      new GetLMSCourseByNameQuery('Curso', false),
    );
    expect(response).toBe(course);
    expect(getSpy).toHaveBeenCalledTimes(1);
  });
  afterAll(() => {
    clearAllMocks();
  });
});
