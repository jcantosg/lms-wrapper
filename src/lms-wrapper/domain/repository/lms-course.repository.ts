import { LmsCourse } from '#/lms-wrapper/domain/entity/lms-course';
import { LmsModuleContent } from '#/lms-wrapper/domain/entity/lms-module-content';
import { LmsStudent } from '#lms-wrapper/domain/entity/lms-student';

export abstract class LmsCourseRepository {
  abstract getOne(id: number, isSpeciality: boolean): Promise<LmsCourse>;

  abstract getAll(): Promise<LmsCourse[]>;

  abstract save(lmsCourse: LmsCourse): Promise<void>;

  abstract getContent(
    id: number,
    contentId: number,
    student: LmsStudent,
    isZeroBlockSubject: boolean,
  ): Promise<LmsModuleContent>;

  abstract getByName(
    name: string,
    isSpeciality: boolean,
  ): Promise<LmsCourse | null>;

  abstract getCourseProgress(
    courseId: number,
    studentId: number,
  ): Promise<number>;

  abstract delete(lmsCourse: LmsCourse): Promise<void>;

  abstract updateCourseModuleStatus(
    courseModuleId: number,
    studentId: number,
    newStatus: number,
  ): Promise<void>;

  abstract getCourse(
    id: number,
    lmsStudent: number,
    isSpeciality: boolean,
  ): Promise<LmsCourse>;
}
