import * as Joi from 'joi';
import {
  FIRST_PAGE,
  DEFAULT_LIMIT,
  LOW_LIMIT,
} from '#/sga/shared/application/collection.query';

export function createCollectionSchema(
  orderByFields: string[],
  additionalFields: Joi.SchemaMap = {},
): Joi.ObjectSchema {
  const baseSchema: Joi.SchemaMap = {
    page: Joi.number().integer().min(FIRST_PAGE).default(FIRST_PAGE),
    limit: Joi.number().min(LOW_LIMIT).default(DEFAULT_LIMIT),
    orderBy: Joi.string()
      .valid(...orderByFields)
      .default(''),
    orderType: Joi.string().valid('ASC', 'DESC').default('ASC').optional(),
  };

  return Joi.object({ ...baseSchema, ...additionalFields });
}
