import Joi from 'joi';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';

export const createAcademicProgramSchema = Joi.object({
  id: Joi.string().guid().required(),
  name: Joi.string().required(),
  code: Joi.string().optional(),
  title: Joi.string().required(),
  businessUnit: Joi.string().guid().required(),
  structureType: Joi.string()
    .valid(...Object.values(ProgramBlockStructureType))
    .required(),
});
