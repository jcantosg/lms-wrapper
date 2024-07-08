import { UpdateSubjectProgressHandler } from '#student-360/academic-offering/subject/application/update-subject-progress/update-subject-progress.handler';
import { UpdateCourseModuleProgressHandler } from '#lms-wrapper/application/lms-course/update-course-module-progress/update-course-module-progress.handler';
import { getASGAStudent } from '#test/entity-factory';
import { getALmsStudent } from '#test/value-object-factory';
import { LmsCourseMockRepository } from '#test/mocks/lms-wrapper/lms-course.mock-repository';
import { UpdateSubjectProgressCommand } from '#student-360/academic-offering/subject/application/update-subject-progress/update-subject-progress.command';
import clearAllMocks = jest.clearAllMocks;

let handler: UpdateSubjectProgressHandler;
let updateCourseModuleProgressHandler: UpdateCourseModuleProgressHandler;
let updateCourseSpy: jest.SpyInstance;
const student = getASGAStudent();
student.lmsStudent = getALmsStudent();
const command = new UpdateSubjectProgressCommand(1, student, 1);

describe('Update Subject Progress Handler', () => {
  beforeAll(() => {
    updateCourseModuleProgressHandler = new UpdateCourseModuleProgressHandler(
      new LmsCourseMockRepository(),
    );
    handler = new UpdateSubjectProgressHandler(
      updateCourseModuleProgressHandler,
    );
    updateCourseSpy = jest.spyOn(updateCourseModuleProgressHandler, 'handle');
  });
  it('should update the progress', async () => {
    await handler.handle(command);
    expect(updateCourseSpy).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    clearAllMocks();
  });
});
