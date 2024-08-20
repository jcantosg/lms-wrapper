import { ValueObject } from '#/sga/shared/domain/value-object/value-object';
import { LmsCourseCategoryEnum } from '#/lms-wrapper/domain/enum/lms-course-category.enum';

export interface LmsModule {
  autoEvaluationTests:
    | undefined
    | {
        id: number;
        name: string;
        content: {
          id: number;
          name: string;
          url: string;
          isCompleted: boolean;
          attempts: number | undefined;
        }[];
      }[];
  officialTests:
    | undefined
    | {
        id: number;
        name: string;
        content: {
          id: number;
          name: string;
          url: string;
          isCompleted: boolean;
          attempts: number | undefined;
        }[];
      }[];
  id: number;
  name: string;
  image: string;
}

export interface LmsCourseValues {
  id: number;
  categoryId: LmsCourseCategoryEnum;
  name: string;
  shortname: string;
  progress: number;
  modules: LmsModule[];
}

export class LmsCourse extends ValueObject<LmsCourseValues> {
  constructor(lmsCourseValues: LmsCourseValues) {
    super(lmsCourseValues);
  }
}
