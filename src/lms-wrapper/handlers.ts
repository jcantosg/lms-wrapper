import { GetLmsCoursesHandler } from '#/lms-wrapper/application/get-lms-courses/get-lms-courses.handler';
import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { CreateLmsCourseHandler } from '#/lms-wrapper/application/create-lms-course/create-lms-course.handler';
import { GetLmsCourseHandler } from '#/lms-wrapper/application/get-lms-course/get-lms-course.handler';
import { CreateLmsStudentHandler } from '#/lms-wrapper/application/create-lms-student/create-lms-student.handler';
import { LmsStudentRepository } from '#/lms-wrapper/domain/repository/lms-student.repository';
import { DeleteLmsStudentHandler } from '#/lms-wrapper/application/delete-lms-student/delete-lms-student.handler';

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

const getLmsCourseHandler = {
  provide: GetLmsCourseHandler,
  useFactory: (repository: LmsCourseRepository) =>
    new GetLmsCourseHandler(repository),
  inject: [LmsCourseRepository],
};

const createLmsStudentHandler = {
  provide: CreateLmsStudentHandler,
  useFactory: (repository: LmsStudentRepository): CreateLmsStudentHandler =>
    new CreateLmsStudentHandler(repository),
  inject: [LmsStudentRepository],
};

const deleteLmsStudentHandler = {
  provide: DeleteLmsStudentHandler,
  useFactory: (repository: LmsStudentRepository): DeleteLmsStudentHandler =>
    new DeleteLmsStudentHandler(repository),
  inject: [LmsStudentRepository],
};

export const handlers = [
  getLmsCoursesHandler,
  createLmsCourseHandler,
  getLmsCourseHandler,
  createLmsStudentHandler,
  deleteLmsStudentHandler,
];
