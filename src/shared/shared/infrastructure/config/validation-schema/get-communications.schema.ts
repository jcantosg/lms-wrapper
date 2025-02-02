import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import { getAllCommunicationStatuses } from '#shared/domain/enum/communication-status.enum';
import Joi from 'joi';

const orderByFields = ['sentBy', 'communicationStatus'];

export const getCommunicationsSchema = createCollectionSchema(orderByFields, {
  subject: Joi.string().optional(),
  sentBy: Joi.string().optional(),
  businessUnit: Joi.string().guid().optional(),
  createdAt: Joi.date().optional(),
  sentAt: Joi.date().optional(),
  communicationStatus: Joi.valid(...getAllCommunicationStatuses()).optional(),
});
