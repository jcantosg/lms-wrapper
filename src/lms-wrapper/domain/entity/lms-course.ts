import { ValueObject } from '#/sga/shared/domain/value-object/value-object';
import { LmsCourseCategoryEnum } from '#/lms-wrapper/domain/enum/lms-course-category.enum';

export interface LmsModule {
  id: number;
  name: string;
  image: string;
}

export interface LmsCourseValues {
  id: number;
  categoryId: LmsCourseCategoryEnum;
  name: string;
  shortname: string;
  modules: LmsModule[];
}

export class LmsCourse extends ValueObject<LmsCourseValues> {
  constructor(lmsCourseValues: LmsCourseValues) {
    super(lmsCourseValues);
  }
}
