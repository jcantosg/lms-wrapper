import { UpdateCourseModuleProgressHandler } from '#lms-wrapper/application/lms-course/update-course-module-progress/update-course-module-progress.handler';
import { LmsCourseRepository } from '#lms-wrapper/domain/repository/lms-course.repository';
import { UpdateCourseModuleProgressCommand } from '#lms-wrapper/application/lms-course/update-course-module-progress/update-course-module-progress.command';
import { LmsCourseMockRepository } from '#test/mocks/lms-wrapper/lms-course.mock-repository';
import clearAllMocks = jest.clearAllMocks;

let handler: UpdateCourseModuleProgressHandler;
let repository: LmsCourseRepository;
let updateProgressSpy: jest.SpyInstance;
const command = new UpdateCourseModuleProgressCommand(1, 1, 1);

describe('Update Course Module Progress Handler Unit Test', () => {
  beforeAll(() => {
    repository = new LmsCourseMockRepository();
    handler = new UpdateCourseModuleProgressHandler(repository);
    updateProgressSpy = jest.spyOn(repository, 'updateCourseModuleStatus');
  });
  it('should update progress', async () => {
    updateProgressSpy.mockImplementation(() => {});
    await handler.handle(command);
    expect(updateProgressSpy).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    clearAllMocks();
  });
});
