import Joi from 'joi';
import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';

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

export const searchAdministrativeGroupsSchema = createCollectionSchema(
  orderByFields,
  {
    text: Joi.string().required(),
  },
);
