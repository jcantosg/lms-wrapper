import { GetLmsCoursesHandler } from '#/lms-wrapper/application/get-lms-courses/get-lms-courses.handler';
import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { CreateLmsCourseHandler } from '#/lms-wrapper/application/create-lms-course/create-lms-course.handler';
import { GetLmsCourseHandler } from '#/lms-wrapper/application/get-lms-course/get-lms-course.handler';
import { CreateLmsStudentHandler } from '#/lms-wrapper/application/create-lms-student/create-lms-student.handler';
import { LmsStudentRepository } from '#/lms-wrapper/domain/repository/lms-student.repository';
import { DeleteLmsStudentHandler } from '#/lms-wrapper/application/delete-lms-student/delete-lms-student.handler';
import { GetLmsCourseContentHandler } from '#/lms-wrapper/application/get-lms-course-content/get-lms-course-content.handler';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { GetLmsCourseByNameHandler } from '#/lms-wrapper/application/get-lms-course-by-name/get-lms-course-by-name.handler';

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

const getLmsCourseContentHandler = {
  provide: GetLmsCourseContentHandler,
  useFactory: (
    subjectGetter: SubjectGetter,
    repository: LmsCourseRepository,
  ): GetLmsCourseContentHandler =>
    new GetLmsCourseContentHandler(subjectGetter, repository),
  inject: [SubjectGetter, LmsCourseRepository],
};
const getLmsCourseByNameHandler = {
  provide: GetLmsCourseByNameHandler,
  useFactory: (repository: LmsCourseRepository): GetLmsCourseByNameHandler =>
    new GetLmsCourseByNameHandler(repository),
  inject: [LmsCourseRepository],
};

export const handlers = [
  getLmsCoursesHandler,
  createLmsCourseHandler,
  getLmsCourseHandler,
  createLmsStudentHandler,
  deleteLmsStudentHandler,
  getLmsCourseContentHandler,
  getLmsCourseByNameHandler,
];
