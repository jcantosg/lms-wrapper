import { GetLmsCourseProgressHandler } from '#lms-wrapper/application/lms-course/get-lms-course-progress/get-lms-course-progress.handler';
import { LmsCourseRepository } from '#lms-wrapper/domain/repository/lms-course.repository';
import { GetLmsCourseProgressQuery } from '#lms-wrapper/application/lms-course/get-lms-course-progress/get-lms-course-progress.query';
import { LmsCourseMockRepository } from '#test/mocks/lms-wrapper/lms-course.mock-repository';

let handler: GetLmsCourseProgressHandler;
let repository: LmsCourseRepository;
const query = new GetLmsCourseProgressQuery(1, 2);
let getProgressSpy: jest.SpyInstance;

describe('Get LMS Course Progress handler Unit Test', () => {
  beforeAll(() => {
    repository = new LmsCourseMockRepository();
    handler = new GetLmsCourseProgressHandler(repository);
    getProgressSpy = jest.spyOn(repository, 'getCourseProgress');
  });
  it('should return a progress number', async () => {
    const expectedResult: number = 5;
    getProgressSpy.mockImplementation(() => Promise.resolve(expectedResult));
    const response = await handler.handle(query);
    expect(response).toBe(expectedResult);
  });
});
