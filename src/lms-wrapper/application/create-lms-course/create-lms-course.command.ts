import { Command } from '#shared/domain/bus/command';
import { LmsCourseCategoryEnum } from '#/lms-wrapper/domain/enum/lms-course-category.enum';

export class CreateLmsCourseCommand implements Command {
  constructor(
    public readonly name: string,
    public readonly shortName: string,
    public readonly categoryId: LmsCourseCategoryEnum,
  ) {}
}
