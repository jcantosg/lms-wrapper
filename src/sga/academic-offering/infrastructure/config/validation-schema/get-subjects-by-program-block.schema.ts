import Joi from 'joi';

const orderByFields = ['name', 'code', 'official_code'];

export const getSubjectsByProgramBlockSchema = Joi.object({
  orderBy: Joi.string()
    .valid(...orderByFields)
    .default('name'),
  orderType: Joi.string().valid('ASC', 'DESC', 'NONE').default('NONE'),
});
