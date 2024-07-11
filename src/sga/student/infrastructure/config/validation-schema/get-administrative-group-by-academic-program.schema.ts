import Joi from 'joi';

export const getAdministrativeGroupByAcademicProgramSchema = Joi.object({
  academicProgramId: Joi.string().uuid().required(),
});
