import { GetLmsCoursesHandler } from '#/lms-wrapper/application/lms-course/get-lms-courses/get-lms-courses.handler';
import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { CreateLmsCourseHandler } from '#/lms-wrapper/application/lms-course/create-lms-course/create-lms-course.handler';
import { GetLmsCourseHandler } from '#/lms-wrapper/application/lms-course/get-lms-course/get-lms-course.handler';
import { CreateLmsStudentHandler } from '#/lms-wrapper/application/lms-student/create-lms-student/create-lms-student.handler';
import { LmsStudentRepository } from '#/lms-wrapper/domain/repository/lms-student.repository';
import { DeleteLmsStudentHandler } from '#/lms-wrapper/application/lms-student/delete-lms-student/delete-lms-student.handler';
import { GetLmsCourseContentHandler } from '#/lms-wrapper/application/lms-course/get-lms-course-content/get-lms-course-content.handler';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { GetLmsCourseByNameHandler } from '#/lms-wrapper/application/lms-course/get-lms-course-by-name/get-lms-course-by-name.handler';
import { GetLmsCourseProgressHandler } from '#/lms-wrapper/application/lms-course/get-lms-course-progress/get-lms-course-progress.handler';
import { UpdateCourseModuleProgressHandler } from '#lms-wrapper/application/lms-course/update-course-module-progress/update-course-module-progress.handler';
import { CreateLmsEnrollmentHandler } from '#lms-wrapper/application/create-lms-enrollment/create-lms-enrollment.handler';
import { LmsEnrollmentRepository } from '#lms-wrapper/domain/repository/lms-enrollment.repository';
import { DeleteLmsEnrollmentHandler } from '#lms-wrapper/application/delete-lms-enrollment/delete-lms-enrollment.handler';
import { GetLmsStudentHandler } from '#lms-wrapper/application/lms-student/get-lms-student/get-lms-student.handler';
import { GetStudentUrlSessionKeyHandler } from '#lms-wrapper/application/lms-student/get-url-session-key/get-student-url-session-key.handler';
import { GetLmsCourseWithQuizzesHandler } from '#lms-wrapper/application/get-lms-course-with-quizzes/get-lms-course-with-quizzes.handler';
import { GetEdaeUserUrlSessionKeyHandler } from '#lms-wrapper/application/lms-teacher/get-url-session-key/get-edae-user-url-session-key.handler';
import { LmsTeacherRepository } from '#lms-wrapper/domain/repository/lms-teacher.repository';
import { ConfigService } from '@nestjs/config';

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

const getLmsCourseProgressHandler = {
  provide: GetLmsCourseProgressHandler,
  useFactory: (repository: LmsCourseRepository): GetLmsCourseProgressHandler =>
    new GetLmsCourseProgressHandler(repository),
  inject: [LmsCourseRepository],
};

const updateLmsCourseModuleProgressHandler = {
  provide: UpdateCourseModuleProgressHandler,
  useFactory: (
    repository: LmsCourseRepository,
  ): UpdateCourseModuleProgressHandler =>
    new UpdateCourseModuleProgressHandler(repository),
  inject: [LmsCourseRepository],
};

const createLmsEnrollmentHandler = {
  provide: CreateLmsEnrollmentHandler,
  useFactory: (
    repository: LmsEnrollmentRepository,
  ): CreateLmsEnrollmentHandler => new CreateLmsEnrollmentHandler(repository),
  inject: [LmsEnrollmentRepository],
};

const deleteLmsEnrollmentHandler = {
  provide: DeleteLmsEnrollmentHandler,
  useFactory: (
    repository: LmsEnrollmentRepository,
  ): DeleteLmsEnrollmentHandler => new DeleteLmsEnrollmentHandler(repository),
  inject: [LmsEnrollmentRepository],
};

const getLmsStudentHandler = {
  provide: GetLmsStudentHandler,
  useFactory: (repository: LmsStudentRepository): GetLmsStudentHandler =>
    new GetLmsStudentHandler(repository),
  inject: [LmsStudentRepository],
};

const getStudentUrlSessionKeyHandler = {
  provide: GetStudentUrlSessionKeyHandler,
  useFactory: (
    repository: LmsStudentRepository,
  ): GetStudentUrlSessionKeyHandler =>
    new GetStudentUrlSessionKeyHandler(repository),
  inject: [LmsStudentRepository],
};

const getLmsCourseWithQuizzesHandler = {
  provide: GetLmsCourseWithQuizzesHandler,
  useFactory: (
    repository: LmsCourseRepository,
  ): GetLmsCourseWithQuizzesHandler =>
    new GetLmsCourseWithQuizzesHandler(repository),
  inject: [LmsCourseRepository],
};

const getEdaeUrlSessionKeyHandler = {
  provide: GetEdaeUserUrlSessionKeyHandler,
  useFactory: (
    repository: LmsTeacherRepository,
    configService: ConfigService,
  ): GetEdaeUserUrlSessionKeyHandler =>
    new GetEdaeUserUrlSessionKeyHandler(
      repository,
      configService.getOrThrow('LMS_TEACHER_URL'),
    ),
  inject: [LmsTeacherRepository, ConfigService],
};

export const handlers = [
  getLmsCoursesHandler,
  createLmsCourseHandler,
  getLmsCourseHandler,
  createLmsStudentHandler,
  deleteLmsStudentHandler,
  getLmsCourseContentHandler,
  getLmsCourseByNameHandler,
  getLmsCourseProgressHandler,
  updateLmsCourseModuleProgressHandler,
  createLmsEnrollmentHandler,
  deleteLmsEnrollmentHandler,
  getLmsStudentHandler,
  getStudentUrlSessionKeyHandler,
  getLmsCourseWithQuizzesHandler,
  getEdaeUrlSessionKeyHandler,
];
