import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import * as Joi from 'joi';
import { IdentityDocumentType } from '#/sga/shared/domain/value-object/identity-document';

export const registerAdminUserSchema: Joi.ObjectSchema = Joi.object({
  id: Joi.string().guid(),
  email: Joi.string().email().required(),
  roles: Joi.array()
    .items(Joi.string().valid(...Object.values(AdminUserRoles)))
    .required(),
  name: Joi.string().required(),
  avatar: Joi.string(),
  businessUnits: Joi.array().items(Joi.string().guid()).min(1).required(),
  surname: Joi.string().required(),
  surname2: Joi.string().optional(),
  identityDocument: Joi.object({
    identityDocumentType: Joi.string()
      .valid(...Object.values(IdentityDocumentType))
      .required(),
    identityDocumentNumber: Joi.string().required(),
  }).required(),
});
