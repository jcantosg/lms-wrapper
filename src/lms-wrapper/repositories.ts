import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { MoodleCourseRepository } from '#/lms-wrapper/infrastructure/repository/moodle-course.repository';
import { MoodleWrapper } from '#/lms-wrapper/infrastructure/wrapper/moodle-wrapper';
import { LmsWrapper } from '#/lms-wrapper/domain/service/lms-wrapper';
import { LmsStudentRepository } from '#/lms-wrapper/domain/repository/lms-student.repository';
import { MoodleStudentRepository } from '#/lms-wrapper/infrastructure/repository/moodle-student.repository';
import { LmsEnrollmentRepository } from '#lms-wrapper/domain/repository/lms-enrollment.repository';
import { MoodleEnrollmentRepository } from '#lms-wrapper/infrastructure/repository/moodle-enrollment.repository';
import { LmsTeacherRepository } from '#lms-wrapper/domain/repository/lms-teacher.repository';
import { MoodleTeacherRepository } from '#lms-wrapper/infrastructure/repository/moodle-teacher.repository';

export const repositories = [
  {
    provide: LmsCourseRepository,
    useFactory: (wrapper: MoodleWrapper): LmsCourseRepository => {
      return new MoodleCourseRepository(wrapper);
    },
    inject: [LmsWrapper],
  },
  {
    provide: LmsStudentRepository,
    useFactory: (wrapper: MoodleWrapper): LmsStudentRepository => {
      return new MoodleStudentRepository(wrapper);
    },
    inject: [LmsWrapper],
  },
  {
    provide: LmsEnrollmentRepository,
    useFactory: (wrapper: MoodleWrapper): LmsEnrollmentRepository => {
      return new MoodleEnrollmentRepository(wrapper);
    },
    inject: [LmsWrapper],
  },
  {
    provide: LmsTeacherRepository,
    useFactory: (wrapper: MoodleWrapper): LmsTeacherRepository => {
      return new MoodleTeacherRepository(wrapper);
    },
    inject: [LmsWrapper],
  },
];
