import { GetLmsCoursesHandler } from '#/lms-wrapper/application/get-lms-courses/get-lms-courses.handler';
import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { CreateLmsCourseHandler } from '#/lms-wrapper/application/create-lms-course/create-lms-course.handler';

const getLmsCoursesHandler = {
  provide: GetLmsCoursesHandler,
  useFactory: (repository: LmsCourseRepository) =>
    new GetLmsCoursesHandler(repository),
  inject: [LmsCourseRepository],
};

const createLmsCourseHandler = {
  provide: CreateLmsCourseHandler,
  useFactory: (repository: LmsCourseRepository): CreateLmsCourseHandler =>
    new CreateLmsCourseHandler(repository),
  inject: [LmsCourseRepository],
};

export const handlers = [getLmsCoursesHandler, createLmsCourseHandler];
