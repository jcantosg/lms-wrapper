import * as Joi from 'joi';

export const getStudentsByProgramsAndGroupsSchema = Joi.object({
  academicProgramIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
  internalGroupIds: Joi.array().items(Joi.string().uuid()).min(0).optional(),
});
