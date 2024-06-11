import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { MoodleCourseRepository } from '#/lms-wrapper/infrastructure/repository/moodle-course.repository';
import { MoodleWrapper } from '#/lms-wrapper/infrastructure/wrapper/moodle-wrapper';
import { LmsWrapper } from '#/lms-wrapper/domain/service/lms-wrapper';
import { LmsStudentRepository } from '#/lms-wrapper/domain/repository/lms-student.repository';
import { MoodleStudentRepository } from '#/lms-wrapper/infrastructure/repository/moodle-student.repository';

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
];
