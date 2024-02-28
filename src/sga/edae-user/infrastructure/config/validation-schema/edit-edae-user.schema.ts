import Joi from 'joi';
import { IdentityDocumentType } from '#/sga/shared/domain/value-object/identity-document';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';

export const editEdaeUserSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().required(),
  surname1: Joi.string().required(),
  surname2: Joi.string().optional(),
  identityDocument: Joi.object({
    identityDocumentType: Joi.string()
      .valid(...Object.values(IdentityDocumentType))
      .required(),
    identityDocumentNumber: Joi.string().required(),
  }).required(),
  roles: Joi.array()
    .items(Joi.string().valid(...Object.values(EdaeRoles)))
    .required(),
  timeZone: Joi.string()
    .valid(...Object.values(TimeZoneEnum))
    .required(),
  isRemote: Joi.boolean().required(),
  location: Joi.string().guid().required(),
  avatar: Joi.string().optional(),
});
