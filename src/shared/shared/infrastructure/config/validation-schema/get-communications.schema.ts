import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = ['sentBy', 'status'];

export const getCommunicationsSchema = createCollectionSchema(orderByFields, {
  subject: Joi.string().optional(),
  sentBy: Joi.string().optional(),
  businessUnit: Joi.string().guid().optional(),
  createdAt: Joi.date().optional(),
  sentAt: Joi.date().optional(),
});
