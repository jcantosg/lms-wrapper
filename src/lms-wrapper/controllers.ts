import { GetCoursesController } from '#/lms-wrapper/infrastructure/controller/get-courses/get-courses.controller';
import { CreateLmsCourseController } from '#/lms-wrapper/infrastructure/controller/create-lms-course.controller';

export const wrapperControllers = [
  GetCoursesController,
  CreateLmsCourseController,
];
