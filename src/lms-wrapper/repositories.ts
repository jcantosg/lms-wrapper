import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { MoodleCourseRepository } from '#/lms-wrapper/infrastructure/repository/moodle-course.repository';
import { MoodleWrapper } from '#/lms-wrapper/infrastructure/wrapper/moodle-wrapper';
import { LmsWrapper } from '#/lms-wrapper/domain/service/lms-wrapper';

export const repositories = [
  {
    provide: LmsCourseRepository,
    useFactory: (wrapper: MoodleWrapper): LmsCourseRepository => {
      return new MoodleCourseRepository(wrapper);
    },
    inject: [LmsWrapper],
  },
];
