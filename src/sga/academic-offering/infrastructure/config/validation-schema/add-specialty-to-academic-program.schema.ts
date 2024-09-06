import Joi from 'joi';

export const addSpecialtyToAcademicProgramSchema = Joi.object({
  subjectId: Joi.string().guid().required(),
});
