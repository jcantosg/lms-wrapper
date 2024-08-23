import Joi from 'joi';

export const getAcademicRecognitionApplicationSchema = Joi.object({
  academicRecord: Joi.string().guid().required(),
});
