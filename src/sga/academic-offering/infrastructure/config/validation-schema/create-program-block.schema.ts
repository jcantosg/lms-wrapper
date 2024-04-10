import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import Joi from 'joi';

export const createProgramBlockSchema = Joi.object({
  academicProgramId: Joi.string().required(),
  structureType: Joi.string()
    .valid(...Object.values(ProgramBlockStructureType))
    .required(),
  blocks: Joi.array().items(Joi.string().guid()).min(1).required(),
});
