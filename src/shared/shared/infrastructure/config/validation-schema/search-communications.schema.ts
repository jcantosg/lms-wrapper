import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = ['sentBy', 'status'];

export const searchCommunicationsSchema = createCollectionSchema(
  orderByFields,
  {
    subjectText: Joi.string().optional(),
  },
);
