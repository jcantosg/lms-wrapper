import { LmsCourse } from '#/lms-wrapper/domain/entity/lms-course';

export abstract class LmsCourseRepository {
  abstract getOne(id: number): Promise<LmsCourse>;

  abstract getAll(): Promise<LmsCourse[]>;

  abstract save(lmsCourse: LmsCourse): Promise<void>;
}
