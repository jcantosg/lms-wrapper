import { LmsCourse } from '#/lms-wrapper/domain/entity/lms-course';

export abstract class LmsWrapper {
  abstract getCourse(id: number): Promise<LmsCourse>;

  abstract getAllCourses(): Promise<LmsCourse[]>;
}
