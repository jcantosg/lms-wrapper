import { GetCoursesController } from '#/lms-wrapper/infrastructure/controller/get-courses/get-courses.controller';
import { CreateLmsCourseController } from '#/lms-wrapper/infrastructure/controller/create-lms-course.controller';
import { GetCourseContentController } from '#/lms-wrapper/infrastructure/controller/get-course-content/get-course-content.controller';
import { GetUrlWithSessionKeyController } from '#lms-wrapper/infrastructure/controller/get-url-with-session-key/get-url-with-session-key.controller';
import { GetEdaeUserUrlWithSessionKeyController } from '#lms-wrapper/infrastructure/controller/get-edae-user-url-session-key/get-url-with-session-key.controller';

export const lmsWrapperControllers = [
  GetCoursesController,
  CreateLmsCourseController,
  GetCourseContentController,
  GetUrlWithSessionKeyController,
  GetEdaeUserUrlWithSessionKeyController,
];
