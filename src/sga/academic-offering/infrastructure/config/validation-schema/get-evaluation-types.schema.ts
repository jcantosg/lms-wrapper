import Joi from 'joi';

export const getEvaluationTypesSchema = Joi.string().guid().required();
