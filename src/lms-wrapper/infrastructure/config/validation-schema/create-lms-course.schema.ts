import Joi from 'joi';
import { getAllLmsCourseCategories } from '#/lms-wrapper/domain/enum/lms-course-category.enum';

export const createLmsCourseSchema = Joi.object({
  name: Joi.string().required(),
  shortName: Joi.string().required(),
  categoryId: Joi.valid(...getAllLmsCourseCategories()),
});
