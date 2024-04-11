import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = ['name', 'title', 'code', 'businessUnit'];

export const searchAcademicProgramsSchema = createCollectionSchema(
  orderByFields,
  {
    text: Joi.string().required(),
  },
);
