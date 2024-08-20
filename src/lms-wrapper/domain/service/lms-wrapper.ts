import { LmsCourse } from '#/lms-wrapper/domain/entity/lms-course';

export abstract class LmsWrapper {
  abstract getCourse(id: number, isSpeciality: boolean): Promise<LmsCourse>;

  abstract getAllCourses(): Promise<LmsCourse[]>;
}
