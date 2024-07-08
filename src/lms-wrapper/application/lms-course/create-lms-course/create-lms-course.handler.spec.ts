import { CreateLmsCourseHandler } from '#/lms-wrapper/application/lms-course/create-lms-course/create-lms-course.handler';
import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { getALmsCourse } from '#test/value-object-factory';
import { LmsCourseMockRepository } from '#test/mocks/lms-wrapper/lms-course.mock-repository';
import { CreateLmsCourseCommand } from '#/lms-wrapper/application/lms-course/create-lms-course/create-lms-course.command';
import { LmsCourseCategoryEnum } from '#/lms-wrapper/domain/enum/lms-course-category.enum';
import clearAllMocks = jest.clearAllMocks;

let handler: CreateLmsCourseHandler;
let repository: LmsCourseRepository;
let saveSpy: jest.SpyInstance;
const lmsCourse = getALmsCourse(1, 'Test');
const command = new CreateLmsCourseCommand(
  lmsCourse.value.name,
  'prueba',
  LmsCourseCategoryEnum.E_LEARNING,
);

describe('Create LMS Course Handler Test', () => {
  beforeAll(() => {
    repository = new LmsCourseMockRepository();
    handler = new CreateLmsCourseHandler(repository);
    saveSpy = jest.spyOn(repository, 'save');
  });
  it('should save a lms course', async () => {
    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    clearAllMocks();
  });
});
