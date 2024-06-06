import { GetLmsCoursesHandler } from '#/lms-wrapper/application/get-lms-courses/get-lms-courses.handler';
import { getALmsCourse } from '#test/value-object-factory';
import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { LmsCourseMockRepository } from '#test/mocks/lms-wrapper/lms-course.mock-repository';
import clearAllMocks = jest.clearAllMocks;

let handler: GetLmsCoursesHandler;
const courses = [
  getALmsCourse(Math.random(), 'Curso'),
  getALmsCourse(Math.random(), 'Curso'),
];
let repository: LmsCourseRepository;
let getAllSpy: jest.SpyInstance;

describe('Get LMS Courses Handler Test', () => {
  beforeAll(() => {
    repository = new LmsCourseMockRepository();
    handler = new GetLmsCoursesHandler(repository);
    getAllSpy = jest.spyOn(repository, 'getAll');
  });
  it('should return a lms courses list', async () => {
    getAllSpy.mockImplementation(() => Promise.resolve(courses));
    const response = await handler.handle();
    expect(response).toBe(courses);
    expect(getAllSpy).toHaveBeenCalledTimes(1);
  });
  afterAll(() => {
    clearAllMocks();
  });
});
