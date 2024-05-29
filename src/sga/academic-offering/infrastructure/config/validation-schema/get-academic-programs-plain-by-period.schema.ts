import Joi from 'joi';

export const getAcademicProgramsPlainByPeriodSchema = Joi.object({
  hasAdministrativeGroup: Joi.boolean().optional(),
});
