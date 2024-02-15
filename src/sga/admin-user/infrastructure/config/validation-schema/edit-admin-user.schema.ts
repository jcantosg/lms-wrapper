import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import * as Joi from 'joi';
import { IdentityDocumentType } from '#/sga/shared/domain/value-object/identity-document';

export const editAdminUserSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  surname2: Joi.string().optional(),
  identityDocument: Joi.object({
    identityDocumentType: Joi.string()
      .valid(...Object.values(IdentityDocumentType))
      .required(),
    identityDocumentNumber: Joi.string().required(),
  }).required(),
  roles: Joi.array()
    .items(Joi.string().valid(...Object.values(AdminUserRoles)))
    .required(),
  avatar: Joi.string(),
});
