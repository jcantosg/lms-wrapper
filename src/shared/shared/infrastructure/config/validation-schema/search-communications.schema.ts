import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = ['sentBy', 'communicationStatus'];

export const searchCommunicationsSchema = createCollectionSchema(
  orderByFields,
  {
    text: Joi.string().required(),
  },
);
