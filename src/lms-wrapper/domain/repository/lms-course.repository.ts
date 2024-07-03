import { LmsCourse } from '#/lms-wrapper/domain/entity/lms-course';
import { LmsModuleContent } from '#/lms-wrapper/domain/entity/lms-module-content';

export abstract class LmsCourseRepository {
  abstract getOne(id: number): Promise<LmsCourse>;

  abstract getAll(): Promise<LmsCourse[]>;

  abstract save(lmsCourse: LmsCourse): Promise<void>;

  abstract getContent(id: number, contentId: number): Promise<LmsModuleContent>;

  abstract getByName(name: string): Promise<LmsCourse>;

  abstract delete(lmsCourse: LmsCourse): Promise<void>;
}
