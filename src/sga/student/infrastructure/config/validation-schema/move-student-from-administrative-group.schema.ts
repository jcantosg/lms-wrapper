import Joi from 'joi';

export const moveStudentFromAdministrativeGroupSchema = Joi.object({
  studentIds: Joi.array().items(Joi.string().guid()).min(1).required(),
  administrativeGroupOriginId: Joi.string().guid().required(),
  administrativeGroupDestinationId: Joi.string().guid().required(),
});
