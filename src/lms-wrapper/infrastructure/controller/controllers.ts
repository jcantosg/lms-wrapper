import { GetCoursesController } from '#/lms-wrapper/infrastructure/controller/get-courses/get-courses.controller';
import { CreateLmsCourseController } from '#/lms-wrapper/infrastructure/controller/create-lms-course.controller';
import { GetCourseContentController } from '#/lms-wrapper/infrastructure/controller/get-course-content/get-course-content.controller';

export const lmsWrapperControllers = [
  GetCoursesController,
  CreateLmsCourseController,
  GetCourseContentController,
];
