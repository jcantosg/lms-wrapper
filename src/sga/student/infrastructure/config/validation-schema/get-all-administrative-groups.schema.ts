import Joi from 'joi';
import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import { MonthEnum } from '#/sga/shared/domain/enum/month.enum';

const orderByFields = [
  'code',
  'academicProgram',
  'academicPeriod',
  'businessUnit',
  'academicYear',
  'startMonth',
  'blockName',
  'studentsNumber',
];

export const getAllAdministrativeGroupsSchema = createCollectionSchema(
  orderByFields,
  {
    code: Joi.string().optional(),
    academicProgram: Joi.string().guid().optional(),
    academicPeriod: Joi.string().guid().optional(),
    businessUnit: Joi.string().guid().optional(),
    startMonth: Joi.number()
      .valid(
        ...Object.values(MonthEnum).filter(
          (value) => typeof value === 'number',
        ),
      )
      .optional(),
    academicYear: Joi.string().optional(),
    blockName: Joi.string().optional(),
  },
);
